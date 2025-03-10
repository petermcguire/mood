import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserColumnNames1741642150875 implements MigrationInterface {
    name = 'FixUserColumnNames1741642150875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "updatedAt" TO "updated_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "updated_at" TO "updatedAt"`);
    }

}
