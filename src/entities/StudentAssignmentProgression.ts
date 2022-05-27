import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Assignment } from "./Assignment";
import { User } from "./User";

@Entity()
export class StudentAssignmentProgression extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ default: 0 })
  public grade: number;

  // Many to One relation with Exam
  @ManyToOne(() => Assignment, (assignment) => assignment.studentAssignmentProgressions, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  public assignment: Assignment;
  // Many to One relation with User
  @ManyToOne(() => User, (user) => user.myAssignmentProgression, {
    onDelete: "CASCADE",
  })
  public user: User;

  @CreateDateColumn()
  public createdAt: Date;

  @CreateDateColumn()
  public updatedAt: Date;
}
