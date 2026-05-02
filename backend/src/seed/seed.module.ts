import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Province } from '../address/entities/province.entity';
import { District } from '../address/entities/district.entity';
import { Commune } from '../address/entities/commune.entity';
import { Village } from '../address/entities/village.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, Province, District, Commune, Village])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
