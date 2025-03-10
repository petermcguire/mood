import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPasswordAndMoodToUserForeignKey1741643154813 implements MigrationInterface {
    name = 'FixPasswordAndMoodToUserForeignKey1741643154813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mood" DROP CONSTRAINT "FK_063b678cbb2c84dfd95dff5da22"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "mood" ADD CONSTRAINT "FK_ac35dd96931ae4c227c93462aab" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mood" DROP CONSTRAINT "FK_ac35dd96931ae4c227c93462aab"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "mood" ADD CONSTRAINT "FK_063b678cbb2c84dfd95dff5da22" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
