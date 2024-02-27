import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateLocationTable1709022892425 implements MigrationInterface {
  name = 'CreateLocationTable1709022892425'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "social_provider" DROP CONSTRAINT "FK_9fc14f13d814ab10af08bb44e8c"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."location_location_type_enum" AS ENUM('ONLINE_EVENT', 'VENUE_EVENT')`
    )
    await queryRunner.query(
      `CREATE TABLE "location" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "venue_name" character varying NOT NULL,
        "street_address" character varying NOT NULL,
        "country" character varying(70) NOT NULL,
        "city" character varying(70) NOT NULL,
        "postalCode" character varying(10) NOT NULL,
        "lat" character varying(50) NOT NULL,
        "long" character varying(50) NOT NULL,
        "state" character varying(70),
        "place_id" character varying(100),
        "location_type" "public"."location_location_type_enum" NOT NULL,
        CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "social_provider" ADD CONSTRAINT "FK_4fdc01924ac0a57444eb4ea4de0" FOREIGN KEY ("customer_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "social_provider" DROP CONSTRAINT "FK_4fdc01924ac0a57444eb4ea4de0"`
    )
    await queryRunner.query(`DROP TABLE "location"`)
    await queryRunner.query(`DROP TYPE "public"."location_location_type_enum"`)
    await queryRunner.query(
      `ALTER TABLE "social_provider" ADD CONSTRAINT "FK_9fc14f13d814ab10af08bb44e8c" FOREIGN KEY ("customer_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }
}
