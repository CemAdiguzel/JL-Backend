import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exam } from "./Exam";
import { User } from "./User";

@Entity()
export class StudentExamProgression extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ default: 0 })
  public grade: number;

  // Many to One relation with Exam
  @ManyToOne(() => Exam, (exam) => exam.studentExamProgressions, {
    onDelete: "CASCADE",
  })
  public exam: Exam;
  // Many to One relation with User
  @ManyToOne(() => User, (user) => user.myExamProgressions, {
    onDelete: "CASCADE",
  })
  public user: User;

  @CreateDateColumn()
  public createdAt: Date;

  @CreateDateColumn()
  public updatedAt: Date;
}
