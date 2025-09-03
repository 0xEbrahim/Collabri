import { MigrationInterface, QueryRunner } from "typeorm";

export class RelUserRoom1756890058298 implements MigrationInterface {
    name = 'RelUserRoom1756890058298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "userId" character varying`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "adminId" integer`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_ca73a9f660cb0311c754925423a" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_ca73a9f660cb0311c754925423a"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "adminId"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "userId"`);
    }

}
