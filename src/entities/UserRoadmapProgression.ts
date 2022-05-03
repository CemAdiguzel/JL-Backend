import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Progression } from './enums';
import { Roadmap } from './Roadmap';
import { User } from './User';

@Entity()
export class UserRoadmapProgression extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  // progression value
  @Column({ default: 0 })
  public value: number;

  @Column({
    type: 'enum',
    enum: Progression,
    default: Progression.NotStarted,
  })
  public progression: Progression;

  @ManyToOne(() => User, (user) => user.roadmapProgressions, {
    onDelete: 'CASCADE',
  })
  public user: User;

  @ManyToOne(() => Roadmap, (roadmap) => roadmap.userProgressions, {
    onDelete: 'CASCADE',
  })
  public roadmap: Roadmap;

  @CreateDateColumn()
  public createdAt: Date;

  @CreateDateColumn()
  public updatedAt: Date;
}
