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
  public date: String;

  @Column()
  public time: string;

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

  @Column()
  public isEnded: boolean;

  // Many to One relation with StudentExamProgression
  @OneToMany(() => StudentExamProgression, (progression) => progression.exam, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  public studentExamProgressions: StudentExamProgression[];

  //One to Many relation with Question
  @OneToMany(() => Question, (question) => question.exam, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  public questions: Question[];
}
