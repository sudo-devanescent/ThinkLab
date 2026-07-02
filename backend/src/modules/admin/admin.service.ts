import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Scenario } from '../../entities/scenario.entity';
import { Session } from '../../entities/session.entity';
import { ScenarioTag } from '../../entities/scenario-tag.entity';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Scenario)
    private scenarioRepository: Repository<Scenario>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(ScenarioTag)
    private scenarioTagRepository: Repository<ScenarioTag>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getStats() {
    const activeUsers = await this.userRepository.count({ where: { isActive: true } });
    const totalScenarios = await this.scenarioRepository.count();
    const activeSessions = await this.sessionRepository.count({ where: { status: 'active' } });
    return { activeUsers, totalScenarios, activeSessions };
  }

  async getScenarios() {
    const scenarios = await this.scenarioRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['scenarioTags', 'scenarioTags.tag'],
    });
    return scenarios.map((s) => ({
      id: s.id,
      title: s.title,
      context: s.context,
      difficultyLevel: s.difficultyLevel,
      expectedRisk: s.expectedRisk,
      tags: s.scenarioTags
        ?.map((st) => st.tag?.name)
        .filter((name): name is string => !!name) ?? [],
    }));
  }
}
