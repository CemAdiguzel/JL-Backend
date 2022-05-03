import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserRole } from "./enums";
import { StudentExamProgression } from "./StudentExamProgression";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column("varchar", { unique: true })
  public email: string;

  @Column({ nullable: true })
  public password: string;

  @Column({ nullable: true })
  public firstName: string;

  @Column({ nullable: true })
  public lastName: string;

  @Column({ nullable: true })
  public about: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.User,
  })
  public userRole: string;

  @OneToMany(() => StudentExamProgression, (progression) => progression.user, {
    onUpdate: "CASCADE",
  })
  public myExamProgressions: StudentExamProgression[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
