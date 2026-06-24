import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'thinklab', name: 'adaptation_rules' })
export class AdaptationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'condition', type: 'jsonb' })
  condition: Record<string, unknown>;

  @Column({ name: 'priority', type: 'int' })
  priority: number;

  @Column({ name: 'next_scenario_tag' })
  nextScenarioTag: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
