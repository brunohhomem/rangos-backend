import { Module } from '@nestjs/common';
import { CalcService } from './calc.service';
import { FoodsModule } from 'src/foods/foods.module';

@Module({
  imports: [FoodsModule],
  providers: [CalcService],
})
export class CalcModule {}
