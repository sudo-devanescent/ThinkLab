import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scenario } from '../../entities/scenario.entity';
import { ScenarioOption } from '../../entities/scenario-option.entity';
import { ScenarioTag } from '../../entities/scenario-tag.entity';
import { Tag } from '../../entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scenario, ScenarioOption, ScenarioTag, Tag])],
})
export class ScenariosModule {}
