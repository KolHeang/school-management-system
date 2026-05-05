import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { PromotionHistory } from './entities/promotion-history.entity';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromotionHistory]),
    StudentsModule,
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
})
export class PromotionsModule {}
