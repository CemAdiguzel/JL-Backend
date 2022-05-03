import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StudentExamProgression } from "./StudentExamProgression";
import { UserRole } from "./enums";
import { UserContentProgression } from "./UserContentProgression";
import { UserRoadmapProgression } from "./UserRoadmapProgression";
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
}
