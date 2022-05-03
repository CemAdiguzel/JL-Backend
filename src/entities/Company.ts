import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roadmap } from './Roadmap';
import { User } from './User';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ default: 'https://static.univerlive.com/image/giorny.png' })
  public logo: string;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text' })
  public description: string;

  @OneToMany(() => Roadmap, (roadmap) => roadmap.company)
  public roadmaps: Roadmap[];

  @OneToMany(() => User, (user) => user.company)
  public users: User[];
}
