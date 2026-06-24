import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Scenario } from './scenario.entity';
import { Tag } from './tag.entity';

@Entity({ schema: 'thinklab', name: 'scenario_tags' })
@Unique(['scenario_id', 'tag_id'])
export class ScenarioTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'scenario_id' })
  scenario_id: string;

  @ManyToOne(() => Scenario, (scenario) => scenario.scenarioTags)
  @JoinColumn({ name: 'scenario_id' })
  scenario: Scenario;

  @Column({ name: 'tag_id' })
  tag_id: string;

  @ManyToOne(() => Tag, (tag) => tag.scenarioTags)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
