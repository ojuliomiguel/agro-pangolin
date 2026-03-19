import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { FarmEntity } from "./farm.entity";

@Entity("producers")
export class ProducerEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ unique: true })
  document: string;

  @Column()
  name: string;

  @OneToMany(() => FarmEntity, (farm) => farm.producer, { cascade: true })
  farms: FarmEntity[];
}
