import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1759264093803 implements MigrationInterface {
    name = 'InitSchema1759264093803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "createdAt"`);
    }

}
