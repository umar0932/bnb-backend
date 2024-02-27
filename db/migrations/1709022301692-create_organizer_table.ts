import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOrganizerTable1709022301692 implements MigrationInterface {
  name = 'CreateOrganizerTable1709022301692'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organizer_user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "website_link" character varying(500),
        "organization_bio" character varying,
        "description" character varying(500),
        "is_active" boolean DEFAULT false,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_8c0ecbf21fb0cd918c7b66de826" UNIQUE ("name"),
        CONSTRAINT "PK_08b6d49054e4b98f17422ac3296" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "organizer_user"`)
  }
}
