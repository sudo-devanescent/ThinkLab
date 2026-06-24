import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ScenarioOption } from './scenario-option.entity';
import { ScenarioTag } from './scenario-tag.entity';

@Entity({ schema: 'thinklab', name: 'scenarios' })
export class Scenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'context', type: 'text' })
  context: string;

  @Column({ name: 'expected_risk', type: 'float' })
  expectedRisk: number;

  @Column({ name: 'difficulty_level' })
  difficultyLevel: string;

  @Column({ name: 'created_by' })
  createdByUserId: string;

  @ManyToOne(() => User, (user) => user.scenarios)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => ScenarioOption, (option) => option.scenario)
  options: ScenarioOption[];

  @OneToMany(() => ScenarioTag, (scenarioTag) => scenarioTag.scenario)
  scenarioTags: ScenarioTag[];
}
