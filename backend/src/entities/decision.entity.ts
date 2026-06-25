import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SessionScenario } from './session-scenario.entity';
import { ScenarioOption } from './scenario-option.entity';

@Entity({ schema: 'thinklab', name: 'decisions' })
export class Decision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_scenario_id', unique: true })
  sessionScenarioId: string;

  @ManyToOne(() => SessionScenario)
  @JoinColumn({ name: 'session_scenario_id' })
  sessionScenario: SessionScenario;

  @Column({ name: 'option_id' })
  optionId: string;

  @ManyToOne(() => ScenarioOption)
  @JoinColumn({ name: 'option_id' })
  option: ScenarioOption;

  @Column({ name: 'response_time_ms', type: 'int' })
  responseTimeMs: number;

  @Column({ name: 'scores_at_decision', type: 'jsonb' })
  scoresAtDecision: Record<string, unknown>;

  @Column({ name: 'decided_at', type: 'timestamptz' })
  createdAt: Date;
}
