import { MigrationInterface, QueryRunner } from "typeorm";

const SEED_PRODUCER_ID = "f8d3878b-9e45-4df3-8686-35baceb0bbdb";
const LEGACY_INVALID_DOCUMENT = "11111111111";
const VALID_DOCUMENTS = [
  "52998224725",
  "44786143693",
  "88807083680",
  "25284798325",
];

export class FixSeedProducerDocument1774317000000
  implements MigrationInterface {
  name = "FixSeedProducerDocument1774317000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const rows = await queryRunner.query(
      `
        SELECT "id", "document"
        FROM "producers"
        WHERE "id" = $1 OR "document" = $2
        ORDER BY CASE WHEN "id" = $1 THEN 0 ELSE 1 END
        LIMIT 1
      `,
      [SEED_PRODUCER_ID, LEGACY_INVALID_DOCUMENT],
    );

    const target = rows[0] as { id: string; document: string } | undefined;

    if (!target || target.document !== LEGACY_INVALID_DOCUMENT) {
      return;
    }

    const replacementDocument = await this.findAvailableDocument(
      queryRunner,
      target.id,
    );

    if (!replacementDocument) {
      throw new Error(
        "Nao foi possivel corrigir o documento invalido do seed porque todos os documentos candidatos ja estao em uso.",
      );
    }

    await queryRunner.query(
      `
        UPDATE "producers"
        SET "document" = $1
        WHERE "id" = $2
      `,
      [replacementDocument, target.id],
    );
  }

  public async down(): Promise<void> {
  }

  private async findAvailableDocument(
    queryRunner: QueryRunner,
    producerId: string,
  ): Promise<string | null> {
    for (const candidate of VALID_DOCUMENTS) {
      const conflict = await queryRunner.query(
        `
          SELECT 1
          FROM "producers"
          WHERE "document" = $1 AND "id" <> $2
          LIMIT 1
        `,
        [candidate, producerId],
      );

      if (conflict.length === 0) {
        return candidate;
      }
    }

    return null;
  }
}
