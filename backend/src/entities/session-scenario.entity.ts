import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Session } from './session.entity';
import { Scenario } from './scenario.entity';

@Entity({ schema: 'thinklab', name: 'session_scenarios' })
@Unique(['session_id', 'scenario_id'])
export class SessionScenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  session_id: string;

  @ManyToOne(() => Session, (session) => session.sessionScenarios)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'scenario_id' })
  scenario_id: string;

  @ManyToOne(() => Scenario)
  @JoinColumn({ name: 'scenario_id' })
  scenario: Scenario;

  @Column({ name: 'session_order', type: 'int' })
  orderIndex: number;
}
