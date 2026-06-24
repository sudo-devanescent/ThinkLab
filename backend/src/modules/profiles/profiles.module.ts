import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CognitiveProfile, User])],
})
export class ProfilesModule {}
