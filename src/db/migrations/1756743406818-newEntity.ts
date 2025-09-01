import { MigrationInterface, QueryRunner } from "typeorm";

export class NewEntity1756743406818 implements MigrationInterface {
    name = 'NewEntity1756743406818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token_entity" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "UQ_2e3c95fdbb51712c33a126fb79d" UNIQUE ("token"), CONSTRAINT "PK_687443f2a51af49b5472e2c5ddc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "token_entity"`);
    }

}
