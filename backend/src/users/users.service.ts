import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, roleId, ...data } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
      role: { id: roleId },
    });
    
    return await this.usersRepository.save(user);
  }

  async findAll() {
    return await this.usersRepository.find({
      relations: ['role'],
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const { password, roleId, ...data } = updateUserDto;
    
    const updated = this.usersRepository.merge(user, {
      ...data,
      ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      role: roleId ? { id: roleId } : user.role,
    });
    
    return await this.usersRepository.save(updated);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return await this.usersRepository.remove(user);
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: { username },
      relations: ['role', 'role.permissions'],
      select: ['id', 'username', 'password'], // Explicitly select password for validation
    });
  }
}
