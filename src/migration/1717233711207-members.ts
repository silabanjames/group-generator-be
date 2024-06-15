import { MigrationInterface, QueryRunner } from "typeorm";

export class Members1717233711207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        ` 
          --Table Definition
          CREATE TABLE "members"  (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "departement" character varying NOT NULL,
            "year" integer NOT NULL,
            "mentorId" uuid,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_MembersId" PRIMARY KEY ("id"),
            FOREIGN KEY ("mentorId") REFERENCES "mentors"("id")
          )
        `
      ),
        undefined;
    }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "users"`, undefined);
    }

}
