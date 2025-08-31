import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1756675974485 implements MigrationInterface {
    name = 'NewMigration1756675974485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "provider" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "providerId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fab34e0791096b2a0a1bf8bd7ff" UNIQUE ("providerId")`);
        await queryRunner.query(`CREATE INDEX "IDX_ae9a93b13bce1425823c8ecd07" ON "users" ("provider", "providerId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ae9a93b13bce1425823c8ecd07"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fab34e0791096b2a0a1bf8bd7ff"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "providerId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "provider"`);
    }

}
