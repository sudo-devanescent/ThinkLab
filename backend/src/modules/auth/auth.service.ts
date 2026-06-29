import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { CognitiveProfile } from '../../entities/cognitive-profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CognitiveProfile)
    private profileRepository: Repository<CognitiveProfile>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string, role: string = 'student') {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }
    if (password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      email,
      passwordHash,
      fullName,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const saved = await this.userRepository.save(user);
    const profile = this.profileRepository.create({
      userId: saved.id,
      coherence: 0.5,
      risk: 0.5,
      consistency: 0.5,
      totalDecisions: 0,
      updatedAt: new Date(),
    });
    await this.profileRepository.save(profile);
    return { id: saved.id, email: saved.email, role: saved.role, fullName: saved.fullName };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, email: user.email, role: user.role, fullName: user.fullName };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
    };
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
