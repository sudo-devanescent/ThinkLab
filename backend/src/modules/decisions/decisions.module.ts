import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Decision } from '../../entities/decision.entity';
import { SessionScenario } from '../../entities/session-scenario.entity';
import { ScenarioOption } from '../../entities/scenario-option.entity';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Decision, SessionScenario, ScenarioOption, CognitiveProfile])],
})
export class DecisionsModule {}
