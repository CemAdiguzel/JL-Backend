import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Content } from "./Content";
import { Progression } from "./enums";
import { User } from "./User";

@Entity()
export class UserContentProgression extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ default: 0 })
  public value: number;

  @Column({
    type: "enum",
    enum: Progression,
    default: Progression.NotStarted,
  })
  public progression: Progression;

  @ManyToOne(() => User, (user) => user.contentProgressions, {
    onDelete: "CASCADE",
  })
  public user: User;

  @ManyToOne(() => Content, (content) => content.userProgressions, {
    onDelete: "CASCADE",
  })
  public content: Content;

  @CreateDateColumn()
  public createdAt: Date;

  @CreateDateColumn()
  public updatedAt: Date;
}
