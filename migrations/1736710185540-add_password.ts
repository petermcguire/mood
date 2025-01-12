import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPassword1736710185540 implements MigrationInterface {
  name = 'AddPassword1736710185540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying(30) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
  }
}
