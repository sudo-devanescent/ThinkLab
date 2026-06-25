import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scenario } from '../../entities/scenario.entity';
import { ScenarioOption } from '../../entities/scenario-option.entity';
import { ScenarioTag } from '../../entities/scenario-tag.entity';
import { Tag } from '../../entities/tag.entity';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';
import { AdaptationRule } from '../../entities/adaptation-rule.entity';
import { Session } from '../../entities/session.entity';
import { SessionScenario } from '../../entities/session-scenario.entity';
import { ScenariosService } from './scenarios.service';
import { ScenariosController } from './scenarios.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Scenario, ScenarioOption, ScenarioTag, Tag,
      CognitiveProfile, AdaptationRule, Session, SessionScenario,
    ]),
  ],
  controllers: [ScenariosController],
  providers: [ScenariosService],
  exports: [ScenariosService],
})
export class ScenariosModule {}
