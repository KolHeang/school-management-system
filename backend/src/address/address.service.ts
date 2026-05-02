import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Commune } from './entities/commune.entity';
import { Village } from './entities/village.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Province) private provinceRepo: Repository<Province>,
    @InjectRepository(District) private districtRepo: Repository<District>,
    @InjectRepository(Commune) private communeRepo: Repository<Commune>,
    @InjectRepository(Village) private villageRepo: Repository<Village>,
  ) {}

  findAllProvinces() {
    return this.provinceRepo.find({ order: { name_en: 'ASC' } });
  }

  findDistrictsByProvince(provinceId: number) {
    return this.districtRepo.find({
      where: { province: { id: provinceId } },
      order: { name_en: 'ASC' },
    });
  }

  findCommunesByDistrict(districtId: number) {
    return this.communeRepo.find({
      where: { district: { id: districtId } },
      order: { name_en: 'ASC' },
    });
  }

  findVillagesByCommune(communeId: number) {
    return this.villageRepo.find({
      where: { commune: { id: communeId } },
      order: { name_en: 'ASC' },
    });
  }
}
