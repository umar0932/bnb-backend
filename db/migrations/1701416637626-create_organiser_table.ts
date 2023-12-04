import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOrganiserTable1701416637626 implements MigrationInterface {
  name = 'CreateOrganiserTable1701416637626'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organizer_user" (
                "idOrganizerUser" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "name" character varying(500) NOT NULL, 
                "website_link" character varying(500), 
                "organization_bio" character varying, 
                "description" character varying, 
                "is_active" boolean DEFAULT true,
                "created_by" character varying(50) NOT NULL DEFAULT 'system', 
                "updated_by" character varying(50) DEFAULT 'system', 
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  
                CONSTRAINT "UQ_8c0ecbf21fb0cd918c7b66de826" UNIQUE ("name"), 
                CONSTRAINT "PK_1817f617621fc94d91e463847cf" PRIMARY KEY ("idOrganizerUser"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "organizer_user"`)
  }
}
