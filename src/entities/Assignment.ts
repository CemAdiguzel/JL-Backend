import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./Question";
@Entity()
export class Assignment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public type: string;

  @Column()
  public date: String;

  @Column()
  public dueDate: string;

  @Column()
  public dueTime: string;

  @Column()
  public duration: string;

  @Column()
  public gradeScale: number;

  @Column()
  public resubmissionNumber: number;

  @Column()
  public resubmissionTime: string;

  @Column()
  public resubmissionDate: string;

  @Column()
  public status: boolean;

  // One to Many relation with Question
  @OneToMany(() => Question, (question) => question.assignment, {
    onUpdate: "CASCADE",
  })
  public questions: Question[];
}
