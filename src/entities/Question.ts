import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Exam } from "./Exam";
@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public questionDesc: string;

  @Column()
  public answer: string;

  @Column()
  public grade: number;

  @Column()
  public gradingInput: string;

  @Column()
  public gradingOutput: string;

  @Column()
  public autoGrade: boolean;

  // Many to One relation with Exam
  @ManyToOne(() => Exam, (exam) => exam.questions, {
    onUpdate: "CASCADE",
  })
  public exam: Exam;
}
