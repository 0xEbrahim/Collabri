import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelations1756814803585 implements MigrationInterface {
    name = 'AddRelations1756814803585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" RENAME COLUMN "senderId" TO "userId"`);
        await queryRunner.query(`CREATE TABLE "roomMembers" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "roomId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7100e8b3f1f488ca9ccef75503c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c28aea07c6fc6c88d943302a08" ON "roomMembers" ("userId", "roomId") `);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" SERIAL NOT NULL, "name" character varying(250), "is_dm" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "roomMembers" ADD CONSTRAINT "FK_cad5bc80dda73821d59ae36ad36" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roomMembers" ADD CONSTRAINT "FK_b81498a907a93a606975772822c" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8"`);
        await queryRunner.query(`ALTER TABLE "roomMembers" DROP CONSTRAINT "FK_b81498a907a93a606975772822c"`);
        await queryRunner.query(`ALTER TABLE "roomMembers" DROP CONSTRAINT "FK_cad5bc80dda73821d59ae36ad36"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c28aea07c6fc6c88d943302a08"`);
        await queryRunner.query(`DROP TABLE "roomMembers"`);
        await queryRunner.query(`ALTER TABLE "messages" RENAME COLUMN "userId" TO "senderId"`);
    }

}
