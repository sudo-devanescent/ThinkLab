import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Decision } from '../../entities/decision.entity';
import { SessionScenario } from '../../entities/session-scenario.entity';
import { ScenarioOption } from '../../entities/scenario-option.entity';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';
import { Session } from '../../entities/session.entity';
import { Scenario } from '../../entities/scenario.entity';
import { AdaptationRule } from '../../entities/adaptation-rule.entity';
import { Tag } from '../../entities/tag.entity';
import { ScenarioTag } from '../../entities/scenario-tag.entity';
import { evaluateDecision } from '../../core/evaluation-engine/engine.js';
import { selectNextScenario } from '../../core/evaluation-engine/adaptive-rules.js';

@Injectable()
export class DecisionsService {
  private readonly logger = new Logger(DecisionsService.name);

  constructor(
    @InjectRepository(Decision)
    private decisionRepository: Repository<Decision>,
    @InjectRepository(SessionScenario)
    private sessionScenarioRepository: Repository<SessionScenario>,
    @InjectRepository(ScenarioOption)
    private optionRepository: Repository<ScenarioOption>,
    @InjectRepository(CognitiveProfile)
    private profileRepository: Repository<CognitiveProfile>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async submitDecision(
    userId: string,
    sessionScenarioId: string,
    optionId: string,
    responseTimeMs: number,
  ) {
    const sessionScenario = await this.sessionScenarioRepository.findOne({
      where: { id: sessionScenarioId },
      relations: ['session', 'scenario', 'scenario.options'],
    });
    if (!sessionScenario) {
      throw new NotFoundException('SessionScenario no encontrado');
    }
    if (sessionScenario.session.userId !== userId) {
      throw new BadRequestException('Este sessionScenario no pertenece al usuario');
    }
    const option = await this.optionRepository.findOne({ where: { id: optionId } });
    if (!option) {
      throw new NotFoundException('Opción no encontrada');
    }
    if (option.scenarioId !== sessionScenario.scenario_id) {
      throw new BadRequestException('La opción no pertenece al escenario');
    }

    let profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepository.create({
        userId,
        coherence: 0.5,
        risk: 0.5,
        consistency: 0.5,
        totalDecisions: 0,
        updatedAt: new Date(),
      });
      await this.profileRepository.save(profile);
    }

    const chosenOption = {
      weights: {
        coherenceImpact: parseFloat(option.coherenceImpact as any),
        riskImpact: parseFloat(option.riskImpact as any),
        consistencyImpact: parseFloat(option.consistencyImpact as any),
      },
    };

    const scenarioContext = {
      id: sessionScenario.scenario.id,
      expectedRisk: parseFloat(sessionScenario.scenario.expectedRisk as any),
    };

    const currentProfile = {
      coherence: parseFloat(profile.coherence as any),
      risk: parseFloat(profile.risk as any),
      consistency: parseFloat(profile.consistency as any),
      totalDecisions: profile.totalDecisions,
    };

    const updatedProfile = evaluateDecision(currentProfile, scenarioContext, chosenOption as any);

    const decision = this.decisionRepository.create({
      sessionScenarioId,
      optionId,
      responseTimeMs,
      scoresAtDecision: updatedProfile as any,
      createdAt: new Date(),
    });
    try {
      await this.decisionRepository.save(decision);
    } catch (error) {
      if (error.message && error.message.includes('fn_validate_decision_option')) {
        throw new BadRequestException('La opción no pertenece al escenario');
      }
      if (error.message && error.message.includes('duplicada') || error.message?.includes('unique')) {
        throw new BadRequestException('Ya existe una decisión para este sessionScenario');
      }
      throw error;
    }

    profile.coherence = updatedProfile.coherence;
    profile.risk = updatedProfile.risk;
    profile.consistency = updatedProfile.consistency;
    profile.totalDecisions = updatedProfile.totalDecisions;
    profile.updatedAt = new Date();
    await this.profileRepository.save(profile);

    return {
      updatedProfile: {
        coherence: updatedProfile.coherence,
        risk: updatedProfile.risk,
        consistency: updatedProfile.consistency,
        totalDecisions: updatedProfile.totalDecisions,
      },
      nextScenarioId: sessionScenario.scenario_id,
    };
  }
}
