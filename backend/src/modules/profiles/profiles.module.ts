import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';
import { User } from '../../entities/user.entity';
import { Decision } from '../../entities/decision.entity';
import { SessionScenario } from '../../entities/session-scenario.entity';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CognitiveProfile, User, Decision, SessionScenario])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
