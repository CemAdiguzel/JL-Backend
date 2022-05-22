import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Question } from "./Question";
@Entity()
export class Answers extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public questionId: string;

  @Column()
  public userId: string;

  @Column()
  public answer: string;

  // One to Many relation with Question
  @ManyToOne(() => Question, (question) => question.answers, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  public questions: Question[];
}
