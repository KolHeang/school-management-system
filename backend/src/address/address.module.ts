import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Commune } from './entities/commune.entity';
import { Village } from './entities/village.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Province, District, Commune, Village])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
