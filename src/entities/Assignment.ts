import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./Question";
import { StudentAssignmentProgression } from "./StudentAssignmentProgression";
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

  @Column()
  public isEnded: boolean;

  // One to Many relation with Question
  @OneToMany(() => Question, (question) => question.assignment, {
    onUpdate: "CASCADE",
  })
  public questions: Question[];
  // One to Many relation with StudentAssignmentProgression
  @OneToMany(
    () => StudentAssignmentProgression,
    (progression) => progression.assignment,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    }
  )
  public studentAssignmentProgressions: StudentAssignmentProgression[];
}
