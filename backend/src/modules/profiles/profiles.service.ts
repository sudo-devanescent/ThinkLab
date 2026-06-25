import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(CognitiveProfile)
    private profileRepository: Repository<CognitiveProfile>,
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

  private getQualitativeLabels(coherence: number, risk: number, consistency: number, totalDecisions: number) {
    return {
      coherenceLabel: coherence >= 0.7 ? 'Alto' : coherence >= 0.4 ? 'Medio' : 'Bajo',
      riskLabel: risk >= 0.7 ? 'Alto' : risk >= 0.4 ? 'Medio' : 'Bajo',
      consistencyLabel: consistency >= 0.7 ? 'Alto' : consistency >= 0.4 ? 'Medio' : 'Bajo',
      experience: totalDecisions === 0 ? 'Sin decisiones' : totalDecisions < 5 ? 'Principiante' : totalDecisions < 15 ? 'Intermedio' : 'Avanzado',
    };
  }
}
