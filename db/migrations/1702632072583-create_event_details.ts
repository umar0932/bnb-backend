import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateEventDetails1702632072583 implements MigrationInterface {
  name = 'CreateEventDetails1702632072583'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_details" (
        "idEventDetails" SERIAL NOT NULL,
        "event_summary" character varying(150) NOT NULL,
        "event_description" character varying(350) NOT NULL,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "ref_id_event" integer, CONSTRAINT "REL_251bc53af940a0e8b1bd829527" UNIQUE ("ref_id_event"), 
        CONSTRAINT "PK_8fba795081c81d1c6fcb39b1de7" PRIMARY KEY ("idEventDetails"))`
    )
    await queryRunner.query(`ALTER TABLE "admin_user" ADD "mediaUrl" character varying(250)`)
    await queryRunner.query(
      `CREATE TYPE "public"."event_event_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'SOLD')`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD "event_status" "public"."event_event_status_enum" NOT NULL DEFAULT 'DRAFT'`
    )
    await queryRunner.query(`ALTER TABLE "event" ADD "ref_id_event_details" integer`)
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "UQ_6efa3d0668460cd0e47fdb09f48" UNIQUE ("ref_id_event_details")`
    )
    await queryRunner.query(
      `ALTER TABLE "event_details" ADD CONSTRAINT "FK_251bc53af940a0e8b1bd829527b" FOREIGN KEY ("ref_id_event") REFERENCES "event"("idEvent") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_6efa3d0668460cd0e47fdb09f48" FOREIGN KEY ("ref_id_event_details") REFERENCES "event_details"("idEventDetails") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_6efa3d0668460cd0e47fdb09f48"`)
    await queryRunner.query(
      `ALTER TABLE "event_details" DROP CONSTRAINT "FK_251bc53af940a0e8b1bd829527b"`
    )
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "UQ_6efa3d0668460cd0e47fdb09f48"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "ref_id_event_details"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "event_status"`)
    await queryRunner.query(`DROP TYPE "public"."event_event_status_enum"`)
    await queryRunner.query(`ALTER TABLE "admin_user" DROP COLUMN "mediaUrl"`)
    await queryRunner.query(`DROP TABLE "event_details"`)
  }
}
