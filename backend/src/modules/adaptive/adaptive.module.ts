import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdaptationRule } from '../../entities/adaptation-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdaptationRule])],
})
export class AdaptiveModule {}
