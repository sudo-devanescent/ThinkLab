import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ScenarioTag } from './scenario-tag.entity';

@Entity({ schema: 'thinklab', name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', unique: true })
  name: string;

  @OneToMany(() => ScenarioTag, (scenarioTag) => scenarioTag.tag)
  scenarioTags: ScenarioTag[];
}
