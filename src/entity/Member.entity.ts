import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Departement } from "../enum/Department.enum";
import { Mentor } from "./Mentor.entity";

@Entity({ name: "members" })
export class Member {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: "enum",
    enum: Departement,
  })
  departement!: Departement;

  @Column()
  year!: number;

  @ManyToOne(() => Mentor, (mentor) => mentor.members)
  mentor!: Mentor | null;
}
