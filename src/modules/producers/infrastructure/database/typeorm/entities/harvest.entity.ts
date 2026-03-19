import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { FarmEntity } from "./farm.entity";
import { CropEntity } from "./crop.entity";

@Entity("harvests")
export class HarvestEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  year: string;

  @ManyToOne(() => FarmEntity, (farm) => farm.harvests, { onDelete: "CASCADE" })
  @JoinColumn({ name: "farm_id" })
  farm: FarmEntity;

  @Column({ name: "farm_id" })
  farmId: string;

  @OneToMany(() => CropEntity, (crop) => crop.harvest, { cascade: true })
  crops: CropEntity[];
}
