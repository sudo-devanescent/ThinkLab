import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, CognitiveProfile])],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
