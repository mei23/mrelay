import {MigrationInterface, QueryRunner} from "typeorm";

export class remoteActor1613143098019 implements MigrationInterface {
    name = 'remoteActor1613143098019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "remote_actor" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "lastFetchedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "username" character varying(128) NOT NULL, "usernameLower" character varying(128) NOT NULL, "publicKey" character varying(4096) NOT NULL, "host" character varying(256) NOT NULL, "inbox" character varying(512) NOT NULL, "sharedInbox" character varying(512), "uri" character varying(512) NOT NULL, CONSTRAINT "PK_5528cbbde60a90d3dc305f3346e" PRIMARY KEY ("id")); COMMENT ON COLUMN "remote_actor"."createdAt" IS 'The created date of the User.'; COMMENT ON COLUMN "remote_actor"."updatedAt" IS 'The updated date of the User.'; COMMENT ON COLUMN "remote_actor"."username" IS 'The username of the User.'; COMMENT ON COLUMN "remote_actor"."usernameLower" IS 'The username (lowercased) of the User.'; COMMENT ON COLUMN "remote_actor"."host" IS 'The host of the User'; COMMENT ON COLUMN "remote_actor"."inbox" IS 'The inbox URL of the User'; COMMENT ON COLUMN "remote_actor"."sharedInbox" IS 'The sharedInbox URL of the User'; COMMENT ON COLUMN "remote_actor"."uri" IS 'The URI of the User'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_37bf503667ebab32947c29b013" ON "remote_actor" ("uri") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_37bf503667ebab32947c29b013"`);
        await queryRunner.query(`DROP TABLE "remote_actor"`);
    }

}
