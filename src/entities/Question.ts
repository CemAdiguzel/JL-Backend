import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Exam } from "./Exam";
import { Assignment } from "./Assignment";
import { Answers } from "./Answer";
@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public questionDesc: string;

  @Column()
  public answer: string;

  @Column()
  public grade: string;

  @Column()
  public gradingInput: string;

  @Column()
  public gradingOutput: string;

  @Column()
  public autoGrade: boolean;

  // Many to One relation with Exam
  @ManyToOne(() => Exam, (exam) => exam.questions, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  public exam: Exam;
  // Many to One relation with Assignment
  @ManyToOne(() => Assignment, (assignment) => assignment.questions, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  public assignment: Assignment;
  // Many to One relation with Answer
  @OneToMany(() => Answers, (answer) => answer.questions, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  public answers: Answers;
}
