import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMoodColumnNames1741641334209 implements MigrationInterface {
    name = 'FixMoodColumnNames1741641334209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mood" RENAME COLUMN "createdAt" TO "created_at"`);
        await queryRunner.query(`ALTER TABLE "mood" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "mood" RENAME COLUMN "userId" TO "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mood" RENAME COLUMN "created_at" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "mood" RENAME COLUMN "updated_at" TO "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "mood" RENAME COLUMN "user_id" TO "userId"`);
    }

}
