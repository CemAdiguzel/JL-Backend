import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ContentType } from './enums';
import { Roadmap } from './Roadmap';
import { UserContentProgression } from './UserContentProgression';

@Entity()
export class Content extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @CreateDateColumn()
  public updatedAt: Date;

  // can either be a blog post or a quiz with multiple select questions
  @Column({ type: 'text' })
  public title: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ nullable: true })
  public content: string;

  @Column({ nullable: true })
  public image: string;

  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.BlogPost,
  })
  public contentType: ContentType;

  // multiple choice questions
  @Column({ type: 'text', nullable: true })
  public question: string;

  @Column({ nullable: true })
  public rightAnswerIdx: number;

  // selections array of strings
  @Column('text', { array: true, default: {} })
  public options: string[];

  // one roadmap can have many contents
  @ManyToOne(() => Roadmap, (roadmap) => roadmap.contents)
  public roadmap: Roadmap;

  @OneToMany(() => UserContentProgression, (progress) => progress.user)
  public userProgressions: UserContentProgression[];
}
