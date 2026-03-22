import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1773963767237 implements MigrationInterface {
  name = "InitialMigration1773963767237";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "crops" (
        "id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "harvest_id" uuid NOT NULL,
        CONSTRAINT "PK_098dbeb7c803dc7c08a7f02b805" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "harvests" (
        "id" uuid NOT NULL,
        "year" character varying NOT NULL,
        "farm_id" uuid NOT NULL,
        CONSTRAINT "PK_fb748ae28bc0000875b1949a0a6" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "farms" (
        "id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "city" character varying NOT NULL,
        "state" character varying(2) NOT NULL,
        "totalArea" numeric(10,2) NOT NULL,
        "agriculturalArea" numeric(10,2) NOT NULL,
        "vegetationArea" numeric(10,2) NOT NULL,
        "producer_id" uuid NOT NULL,
        CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "producers" (
        "id" uuid NOT NULL,
        "document" character varying NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "UQ_55554aac38152436aa25b1e3530" UNIQUE ("document"),
        CONSTRAINT "PK_7f16886d1a44ed0974232b82506" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "crops"
      ADD CONSTRAINT "FK_33def18beba78449f5f4e99aa2f"
      FOREIGN KEY ("harvest_id") REFERENCES "harvests"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "harvests"
      ADD CONSTRAINT "FK_231c2de20d25d78746cc6b36fca"
      FOREIGN KEY ("farm_id") REFERENCES "farms"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "farms"
      ADD CONSTRAINT "FK_9c593007fa71180e11f2af67458"
      FOREIGN KEY ("producer_id") REFERENCES "producers"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "farms" DROP CONSTRAINT "FK_9c593007fa71180e11f2af67458"`,
    );
    await queryRunner.query(
      `ALTER TABLE "harvests" DROP CONSTRAINT "FK_231c2de20d25d78746cc6b36fca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crops" DROP CONSTRAINT "FK_33def18beba78449f5f4e99aa2f"`,
    );
    await queryRunner.query(`DROP TABLE "producers"`);
    await queryRunner.query(`DROP TABLE "farms"`);
    await queryRunner.query(`DROP TABLE "harvests"`);
    await queryRunner.query(`DROP TABLE "crops"`);
  }
}
