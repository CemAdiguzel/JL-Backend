import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "./Company";
import { UserRole } from "./enums";
import { UserContentProgression } from "./UserContentProgression";
import { UserRoadmapProgression } from "./UserRoadmapProgression";
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

  // roadmap progress relation
  @ManyToOne(() => Company, (company) => company.users)
  public company: Company;

  @OneToMany(() => UserRoadmapProgression, (progress) => progress.user)
  public roadmapProgressions: UserRoadmapProgression[];

  @OneToMany(() => UserContentProgression, (progress) => progress.user)
  public contentProgressions: UserContentProgression[];
  // One to Many with StudentExamProgression
  @OneToMany(() => StudentExamProgression, (progression) => progression.user, {
    onUpdate: "CASCADE",
  })
  public myExamProgressions: StudentExamProgression[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
