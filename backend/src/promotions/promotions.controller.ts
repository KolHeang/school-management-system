import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromoteStudentsDto } from './dto/promote-students.dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Patch()
  promote(@Body() promoteStudentsDto: PromoteStudentsDto) {
    return this.promotionsService.promote(promoteStudentsDto);
  }

  @Get('history')
  findAllPromotions() {
    return this.promotionsService.findAllPromotions();
  }
}
