import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'thinklab', name: 'cognitive_profiles' })
export class CognitiveProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'coherence', type: 'float' })
  coherence: number;

  @Column({ name: 'risk', type: 'float' })
  risk: number;

  @Column({ name: 'consistency', type: 'float' })
  consistency: number;

  @Column({ name: 'total_decisions', type: 'int' })
  totalDecisions: number;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
