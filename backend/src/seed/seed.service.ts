import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
const csv = require('csv-parser');
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Province } from '../address/entities/province.entity';
import { District } from '../address/entities/district.entity';
import { Commune } from '../address/entities/commune.entity';
import { Village } from '../address/entities/village.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    @InjectRepository(Province) private provinceRepository: Repository<Province>,
    @InjectRepository(District) private districtRepository: Repository<District>,
    @InjectRepository(Commune) private communeRepository: Repository<Commune>,
    @InjectRepository(Village) private villageRepository: Repository<Village>,
  ) { }

  private async parseCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      if (!fs.existsSync(filePath)) {
        console.warn(`Seed: File not found ${filePath}`);
        return resolve([]);
      }
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err: any) => reject(err));
    });
  }

  async seed() {
    await this.seedPermissionsAndUsers();
    await this.seedAddresses();
    return { message: 'Database seeded successfully' };
  }

  async seedPermissionsAndUsers() {
    // 1. Create Permissions
    const permissionsData = [
      { name: 'manage_users', description: 'Can create and edit users' },
      { name: 'manage_roles', description: 'Can manage roles and permissions' },
      { name: 'manage_students', description: 'Can manage student records' },
      { name: 'manage_teachers', description: 'Can manage teacher records' },
      { name: 'manage_classes', description: 'Can manage classroom records' },
      { name: 'mark_attendance', description: 'Can mark student attendance' },
      { name: 'view_dashboard', description: 'Can view dashboard statistics' },
    ];

    const permissions: Permission[] = [];
    for (const pData of permissionsData) {
      let p = await this.permissionRepository.findOne({ where: { name: pData.name } });
      if (!p) {
        p = this.permissionRepository.create(pData);
        p = await this.permissionRepository.save(p);
      }
      permissions.push(p);
    }

    // 2. Create Admin Role
    let adminRole = await this.roleRepository.findOne({ where: { name: 'Admin' }, relations: ['permissions'] });
    if (!adminRole) {
      adminRole = this.roleRepository.create({
        name: 'Admin',
        permissions: permissions, // Admin has all permissions
      });
      adminRole = await this.roleRepository.save(adminRole);
    }

    // 3. Create Teacher Role
    let teacherRole = await this.roleRepository.findOne({ where: { name: 'Teacher' } });
    if (!teacherRole) {
      const teacherPermissions = permissions.filter(p =>
        ['manage_students', 'mark_attendance', 'view_dashboard'].includes(p.name)
      );
      teacherRole = this.roleRepository.create({
        name: 'Teacher',
        permissions: teacherPermissions,
      });
      teacherRole = await this.roleRepository.save(teacherRole);
    }

    // 4. Create Initial Admin User
    const adminUser = await this.userRepository.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin@123', 10);
      const newUser = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
        role: adminRole,
      });
      await this.userRepository.save(newUser);
      console.log('Seed: Admin user created (admin / password123)');
    }

    return { message: 'Database seeded successfully' };
  }

  async seedAddresses() {
    const seedPath = path.join(process.cwd(), 'src', 'seed', 'provinceData');

    // 1. Provinces
    const provinceCount = await this.provinceRepository.count();
    if (provinceCount === 0) {
      console.log('Seed: Importing Provinces...');
      const provinces = await this.parseCsv(path.join(seedPath, 'provinces.csv'));
      for (const row of provinces) {
        const code = parseInt(row.code);
        if (isNaN(code)) continue;
        await this.provinceRepository.save({
          code: code,
          name_km: row.name_km,
          name_en: row.name_en,
          type: row.type || 'Province'
        });
      }
    }

    // 2. Districts
    const districtCount = await this.districtRepository.count();
    if (districtCount === 0) {
      console.log('Seed: Importing Districts...');
      const districts = await this.parseCsv(path.join(seedPath, 'districts.csv'));
      for (const row of districts) {
        const code = parseInt(row.code);
        if (isNaN(code)) continue;
        
        const provinceCode = Math.floor(code / 100);
        const province = await this.provinceRepository.findOne({ where: { code: provinceCode } });
        
        if (province) {
          await this.districtRepository.save({
            code: code,
            name_km: row.name_km,
            name_en: row.name_en,
            type: row.type || 'District',
            province: province
          });
        }
      }
    }

    // 3. Communes
    const communeCount = await this.communeRepository.count();
    if (communeCount === 0) {
      console.log('Seed: Importing Communes...');
      const communes = await this.parseCsv(path.join(seedPath, 'communes.csv'));
      for (const row of communes) {
        const code = parseInt(row.code);
        if (isNaN(code)) continue;

        const districtCode = Math.floor(code / 100);
        const district = await this.districtRepository.findOne({ where: { code: districtCode } });
        
        if (district) {
          await this.communeRepository.save({
            code: code,
            name_km: row.name_km,
            name_en: row.name_en,
            type: row.type || 'Commune',
            district: district
          });
        }
      }
    }

    // 4. Villages
    const villageCount = await this.villageRepository.count();
    if (villageCount === 0) {
      console.log('Seed: Importing Villages...');
      const villages = await this.parseCsv(path.join(seedPath, 'villages.csv'));
      for (const row of villages) {
        const code = parseInt(row.code);
        if (isNaN(code)) continue;

        const communeCode = Math.floor(code / 100);
        const commune = await this.communeRepository.findOne({ where: { code: communeCode } });
        
        if (commune) {
          await this.villageRepository.save({
            code: code,
            name_km: row.name_km,
            name_en: row.name_en,
            type: row.type || 'Village',
            commune: commune
          });
        }
      }
    }
  }
}
