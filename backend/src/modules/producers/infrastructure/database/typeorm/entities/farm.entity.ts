import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ProducerEntity } from "./producer.entity";
import { HarvestEntity } from "./harvest.entity";

@Entity("farms")
export class FarmEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column("numeric", { precision: 10, scale: 2 })
  totalArea: number;

  @Column("numeric", { precision: 10, scale: 2 })
  agriculturalArea: number;

  @Column("numeric", { precision: 10, scale: 2 })
  vegetationArea: number;

  @ManyToOne(() => ProducerEntity, (producer) => producer.farms, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "producer_id" })
  producer: ProducerEntity;

  @Column({ name: "producer_id" })
  producerId: string;

  @OneToMany(() => HarvestEntity, (harvest) => harvest.farm, { cascade: true })
  harvests: HarvestEntity[];
}
