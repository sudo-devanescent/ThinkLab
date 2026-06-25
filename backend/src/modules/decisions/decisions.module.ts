import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Decision } from '../../entities/decision.entity';
import { SessionScenario } from '../../entities/session-scenario.entity';
import { ScenarioOption } from '../../entities/scenario-option.entity';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';
import { Session } from '../../entities/session.entity';
import { DecisionsService } from './decisions.service';
import { DecisionsController } from './decisions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Decision, SessionScenario, ScenarioOption, CognitiveProfile, Session])],
  controllers: [DecisionsController],
  providers: [DecisionsService],
  exports: [DecisionsService],
})
export class DecisionsModule {}
