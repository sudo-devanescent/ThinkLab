import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Scenario } from './scenario.entity';
import { Tag } from './tag.entity';

@Entity({ schema: 'thinklab', name: 'scenario_tags' })
export class ScenarioTag {
  @PrimaryColumn({ name: 'scenario_id' })
  scenario_id: string;

  @ManyToOne(() => Scenario, (scenario) => scenario.scenarioTags)
  @JoinColumn({ name: 'scenario_id' })
  scenario: Scenario;

  @PrimaryColumn({ name: 'tag_id' })
  tag_id: string;

  @ManyToOne(() => Tag, (tag) => tag.scenarioTags)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
