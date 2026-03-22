import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { HarvestEntity } from "./harvest.entity";

@Entity("crops")
export class CropEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => HarvestEntity, (harvest) => harvest.crops, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "harvest_id" })
  harvest: HarvestEntity;

  @Column({ name: "harvest_id" })
  harvestId: string;
}
