import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SeedModule } from './seed/seed.module';
import { AddressModule } from './address/address.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ReportsModule } from './reports/reports.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    StudentsModule,
    PromotionsModule,
    TeachersModule,
    ClassroomsModule,
    DashboardModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    AttendanceModule,
    SeedModule,
    AddressModule,
    SubjectsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
