import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StudentExamProgression } from "./StudentExamProgression";
import { Question } from "./Question";
@Entity()
export class Exam extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public type: string;

  @Column()
  public date: Date;

  @Column()
  public time: String;

  @Column()
  public dueDate: Date;

  @Column()
  public dueTime: string;

  @Column()
  public duration: string;

  @Column()
  public gradeScale: number;

  @Column()
  public resubmissionNumber: number;

  @Column()
  public resubmissionTime: String;

  @Column()
  public resubmissionDate: Date;

  @Column()
  public status: boolean;

  // Many to One relation with StudentExamProgression
  @OneToMany(() => StudentExamProgression, (progression) => progression.exam, {
    onUpdate: "CASCADE",
  })
  public studentExamProgressions: StudentExamProgression[];

  //One to Many relation with Question
  @OneToMany(() => Question, (question) => question.exam, {
    onUpdate: "CASCADE",
  })
  public questions: Question[];
}
