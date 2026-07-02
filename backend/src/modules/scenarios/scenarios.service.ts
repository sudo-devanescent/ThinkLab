import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scenario } from '../../entities/scenario.entity';
import { ScenarioOption } from '../../entities/scenario-option.entity';
import { ScenarioTag } from '../../entities/scenario-tag.entity';
import { Tag } from '../../entities/tag.entity';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';
import { AdaptationRule } from '../../entities/adaptation-rule.entity';
import { Session } from '../../entities/session.entity';
import { SessionScenario } from '../../entities/session-scenario.entity';
import { selectNextScenario } from '../../core/evaluation-engine/adaptive-rules.js';

export interface ScenarioOptionPlain {
  id: string;
  code: string;
  text: string;
  narrativeConsequence: string;
}

export interface ScenarioPlain {
  id: string;
  title: string;
  context: string;
  difficultyLevel: string;
  options: ScenarioOptionPlain[];
}

@Injectable()
export class ScenariosService {
  private readonly logger = new Logger(ScenariosService.name);

  constructor(
    @InjectRepository(Scenario)
    private scenarioRepository: Repository<Scenario>,
    @InjectRepository(ScenarioOption)
    private optionRepository: Repository<ScenarioOption>,
    @InjectRepository(ScenarioTag)
    private scenarioTagRepository: Repository<ScenarioTag>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(CognitiveProfile)
    private profileRepository: Repository<CognitiveProfile>,
    @InjectRepository(AdaptationRule)
    private ruleRepository: Repository<AdaptationRule>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(SessionScenario)
    private sessionScenarioRepository: Repository<SessionScenario>,
  ) {}

  private mapScenarioWithOptions(scenario: Scenario): ScenarioPlain {
    return {
      id: scenario.id,
      title: scenario.title,
      context: scenario.context,
      difficultyLevel: scenario.difficultyLevel,
      options: scenario.options.map((opt) => ({
        id: opt.id,
        code: opt.code,
        text: opt.text,
        narrativeConsequence: opt.narrativeConsequence,
      })),
    };
  }

  async getNextScenario(userId: string) {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      return this.getFallbackScenario(userId);
    }
    const profileData = {
      coherence_score: profile.coherence,
      risk_score: profile.risk,
      consistency_score: profile.consistency,
      total_decisions: profile.totalDecisions,
    };

    const rules = await this.ruleRepository.find({ where: { isActive: true } });
    const ruleData = rules.map((r) => ({
      id: r.id,
      condition: r.condition as Record<string, any>,
      nextScenarioTag: r.nextScenarioTag,
      priority: r.priority,
    }));

    const tagName = selectNextScenario(profileData as any, ruleData as any) || 'finanzas';
    this.logger.log(`Tag seleccionado: ${tagName} para usuario ${userId}`);

    const tag = await this.tagRepository.findOne({ where: { name: tagName } });
    let scenario: Scenario | null = null;

    if (tag) {
      const scenarioTag = await this.scenarioTagRepository.findOne({
        where: { tag_id: tag.id },
        relations: ['scenario'],
      });
      if (scenarioTag) {
        scenario = await this.scenarioRepository.findOne({
          where: { id: scenarioTag.scenario_id },
          relations: ['options'],
        });
      }
    }
    if (!scenario) {
      scenario = await this.scenarioRepository.findOne({
        order: { createdAt: 'DESC' },
        relations: ['options'],
      });
    }
    if (!scenario) {
      throw new NotFoundException('No hay escenarios disponibles');
    }

    let session = await this.sessionRepository.findOne({
      where: { userId, status: 'active' },
    });
    if (!session) {
      session = this.sessionRepository.create({
        userId,
        startedAt: new Date(),
        status: 'active',
      });
      session = await this.sessionRepository.save(session);
    }

    const existing = await this.sessionScenarioRepository.findOne({
      where: { session_id: session.id, scenario_id: scenario.id },
    });
    if (existing) {
      return {
        scenario: this.mapScenarioWithOptions(scenario),
        sessionScenarioId: existing.id,
        sessionId: session.id,
        orderIndex: existing.orderIndex,
      };
    }

    const maxOrder = await this.sessionScenarioRepository
      .createQueryBuilder('ss')
      .where('ss.session_id = :sessionId', { sessionId: session.id })
      .select('MAX(ss.session_order)', 'max')
      .getRawOne();
    const orderIndex = (maxOrder?.max ?? 0) + 1;

    const sessionScenario = this.sessionScenarioRepository.create({
      session_id: session.id,
      scenario_id: scenario.id,
      orderIndex,
    });
    await this.sessionScenarioRepository.save(sessionScenario);

    return { scenario: this.mapScenarioWithOptions(scenario), sessionScenarioId: sessionScenario.id, sessionId: session.id, orderIndex };
  }

  private async getFallbackScenario(userId: string) {
    const scenario = await this.scenarioRepository.findOne({
      order: { createdAt: 'DESC' },
      relations: ['options'],
    });
    if (!scenario) {
      throw new NotFoundException('No hay escenarios disponibles');
    }
    let session = await this.sessionRepository.findOne({
      where: { userId, status: 'active' },
    });
    if (!session) {
      session = this.sessionRepository.create({
        userId,
        startedAt: new Date(),
        status: 'active',
      });
      session = await this.sessionRepository.save(session);
    }
    const maxOrder = await this.sessionScenarioRepository
      .createQueryBuilder('ss')
      .where('ss.session_id = :sessionId', { sessionId: session.id })
      .select('MAX(ss.session_order)', 'max')
      .getRawOne();
    const orderIndex = (maxOrder?.max ?? 0) + 1;
    const sessionScenario = this.sessionScenarioRepository.create({
      session_id: session.id,
      scenario_id: scenario.id,
      orderIndex,
    });
    await this.sessionScenarioRepository.save(sessionScenario);
    return { scenario: this.mapScenarioWithOptions(scenario), sessionScenarioId: sessionScenario.id, sessionId: session.id, orderIndex };
  }
}
