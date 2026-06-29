import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CognitiveProfile)
    private profileRepository: Repository<CognitiveProfile>,
  ) {}

  async getStudents() {
    const users = await this.userRepository.find({
      where: { role: 'student' },
    });
    const profiles = await this.profileRepository.find();
    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    return users
      .map((user) => {
        const profile = profileMap.get(user.id);
        return {
          userId: user.id,
          fullName: user.fullName,
          email: user.email,
          coherence: profile?.coherence ?? 0.5,
          risk: profile?.risk ?? 0.5,
          consistency: profile?.consistency ?? 0.5,
          totalDecisions: profile?.totalDecisions ?? 0,
        };
      })
      .sort((a, b) => b.totalDecisions - a.totalDecisions);
  }

  async getStudentById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, role: 'student' },
    });
    if (!user) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    const profile = await this.profileRepository.findOne({
      where: { userId: id },
    });
    return {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      coherence: profile?.coherence ?? 0.5,
      risk: profile?.risk ?? 0.5,
      consistency: profile?.consistency ?? 0.5,
      totalDecisions: profile?.totalDecisions ?? 0,
    };
  }
}
