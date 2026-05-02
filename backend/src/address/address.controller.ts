import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('provinces')
  getProvinces() {
    return this.addressService.findAllProvinces();
  }

  @Get('districts/:provinceId')
  getDistricts(@Param('provinceId') provinceId: string) {
    return this.addressService.findDistrictsByProvince(+provinceId);
  }

  @Get('communes/:districtId')
  getCommunes(@Param('districtId') districtId: string) {
    return this.addressService.findCommunesByDistrict(+districtId);
  }

  @Get('villages/:communeId')
  getVillages(@Param('communeId') communeId: string) {
    return this.addressService.findVillagesByCommune(+communeId);
  }
}
