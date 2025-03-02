import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandPasswordLength1740937935656 implements MigrationInterface {
  name = 'ExpandPasswordLength1740937935656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" TYPE VARCHAR(64)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" TYPE VARCHAR(30)`,
    );
  }
}
