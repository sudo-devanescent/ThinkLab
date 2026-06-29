import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';
import { Decision } from '../../entities/decision.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(CognitiveProfile)
    private profileRepository: Repository<CognitiveProfile>,
    @InjectRepository(Decision)
    private decisionRepository: Repository<Decision>,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      return {
        coherence: 0.5,
        risk: 0.5,
        consistency: 0.5,
        totalDecisions: 0,
        updatedAt: null,
        qualitative: this.getQualitativeLabels(0.5, 0.5, 0.5, 0),
      };
    }
    return {
      coherence: profile.coherence,
      risk: profile.risk,
      consistency: profile.consistency,
      totalDecisions: profile.totalDecisions,
      updatedAt: profile.updatedAt,
      qualitative: this.getQualitativeLabels(
        profile.coherence,
        profile.risk,
        profile.consistency,
        profile.totalDecisions,
      ),
    };
  }

  async getHistory(userId: string) {
    const rows = await this.decisionRepository
      .createQueryBuilder('d')
      .innerJoin('d.sessionScenario', 'ss')
      .innerJoin('ss.session', 'ses')
      .innerJoin('ss.scenario', 's')
      .innerJoin('d.option', 'o')
      .where('ses.userId = :userId', { userId })
      .select([
        's.title AS "scenarioTitle"',
        'o.code AS "optionCode"',
        's.difficultyLevel AS "difficulty"',
      ])
      .orderBy('d.createdAt', 'DESC')
      .limit(5)
      .getRawMany();

    return rows;
  }

  private getQualitativeLabels(coherence: number, risk: number, consistency: number, totalDecisions: number) {
    return {
      coherenceLabel: coherence >= 0.7 ? 'Alto' : coherence >= 0.4 ? 'Medio' : 'Bajo',
      riskLabel: risk >= 0.7 ? 'Alto' : risk >= 0.4 ? 'Medio' : 'Bajo',
      consistencyLabel: consistency >= 0.7 ? 'Alto' : consistency >= 0.4 ? 'Medio' : 'Bajo',
      experience: totalDecisions === 0 ? 'Sin decisiones' : totalDecisions < 5 ? 'Principiante' : totalDecisions < 15 ? 'Intermedio' : 'Avanzado',
    };
  }
}
