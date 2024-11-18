import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1731149109126 implements MigrationInterface {
    name = 'Initial1731149109126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mood" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "level" integer NOT NULL, "userId" integer, CONSTRAINT "PK_cd069bf46deedf0ef3a7771f44b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mood" ADD CONSTRAINT "FK_063b678cbb2c84dfd95dff5da22" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mood" DROP CONSTRAINT "FK_063b678cbb2c84dfd95dff5da22"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "mood"`);
    }

}
