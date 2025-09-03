import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdMsg1756895630434 implements MigrationInterface {
    name = 'UpdMsg1756895630434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "read" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "read"`);
    }

}
