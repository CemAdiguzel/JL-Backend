import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Content } from './Content';
import { UserRoadmapProgression } from './UserRoadmapProgression';
import { Company } from './Company';

@Entity()
export class Roadmap extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'text' })
  public title: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ default: 'https://static.univerlive.com/image/giorny.png', nullable: true })
  public image: string;

  @OneToMany(() => UserRoadmapProgression, (progression) => progression.roadmap)
  public userProgressions: UserRoadmapProgression[];

  @OneToMany(() => Content, (content) => content.roadmap)
  public contents: Content[];

  @ManyToOne(() => Company, (company) => company.roadmaps)
  public company: Company;
}
