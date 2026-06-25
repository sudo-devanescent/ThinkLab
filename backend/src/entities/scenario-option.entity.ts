import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Scenario } from './scenario.entity';

@Entity({ schema: 'thinklab', name: 'scenario_options' })
export class ScenarioOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'scenario_id' })
  scenarioId: string;

  @ManyToOne(() => Scenario, (scenario) => scenario.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scenario_id' })
  scenario: Scenario;

  @Column({ name: 'option_code' })
  code: string;

  @Column({ name: 'text', type: 'text' })
  text: string;

  @Column({ name: 'narrative_consequence', type: 'text' })
  narrativeConsequence: string;

  @Column({ name: 'coherence_impact', type: 'float' })
  coherenceImpact: number;

  @Column({ name: 'risk_impact', type: 'float' })
  riskImpact: number;

  @Column({ name: 'consistency_impact', type: 'float' })
  consistencyImpact: number;
}
