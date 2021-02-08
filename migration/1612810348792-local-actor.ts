import {MigrationInterface, QueryRunner} from "typeorm";

export class localActor1612810348792 implements MigrationInterface {
    name = 'localActor1612810348792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "local_actor" ("id" character varying(32) NOT NULL, "username" character varying(128) NOT NULL, "usernameLower" character varying(128) NOT NULL, "publicKey" character varying(4096) NOT NULL, "privateKey" character varying(4096) NOT NULL, CONSTRAINT "PK_43b1f735c081a516ba72871fe8d" PRIMARY KEY ("id")); COMMENT ON COLUMN "local_actor"."username" IS 'The username of the User.'; COMMENT ON COLUMN "local_actor"."usernameLower" IS 'The username (lowercased) of the User.'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_44a297d2d11d37cec056d58dc5" ON "local_actor" ("usernameLower") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_44a297d2d11d37cec056d58dc5"`);
        await queryRunner.query(`DROP TABLE "local_actor"`);
    }

}
