import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Departement } from "../enum/Department.enum";
import { Member } from "./Member.entity";

@Entity({ name: "mentors" })
export class Mentor {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({
    type: "enum",
    enum: Departement,
  })
  departement!: Departement;

  @OneToMany(() => Member, (member) => member.mentor, {nullable: true})
  members!: Member[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
