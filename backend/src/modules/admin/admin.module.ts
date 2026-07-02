import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Scenario } from '../../entities/scenario.entity';
import { Session } from '../../entities/session.entity';
import { ScenarioTag } from '../../entities/scenario-tag.entity';
import { Tag } from '../../entities/tag.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Scenario, Session, ScenarioTag, Tag])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
