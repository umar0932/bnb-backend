import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateEventAndEventDetailsTable1709024092859 implements MigrationInterface {
  name = 'CreateEventAndEventDetailsTable1709024092859'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_event_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'SOLD')`
    )
    await queryRunner.query(
      `CREATE TABLE "event" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "location_id" uuid,
          "category_id" uuid,
          "subCategory_id" uuid,
          "title" character varying(50) NOT NULL,
          "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
          "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
          "tags" text,
          "type" character varying(50),
          "event_status" "public"."event_event_status_enum" NOT NULL DEFAULT 'DRAFT',
          "created_by" character varying(50) NOT NULL DEFAULT 'system',
          "updated_by" character varying(50) DEFAULT 'system',
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_4ccd63876554023ce6a4e863c2d" UNIQUE ("title"),
          CONSTRAINT "REL_ff5c43e186f7faf15a975004d7" UNIQUE ("location_id"),
          CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "event_details" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "event_id" uuid,
        "summary" character varying(500) NOT NULL, "description" character varying(500) NOT NULL,
        "event_images" text NOT NULL,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "REL_c760e9ad9dbcc99f55b5a85877" UNIQUE ("event_id"),
        CONSTRAINT "PK_e7753a530518edb90d77d0919a1" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "event_details" ADD CONSTRAINT "FK_c760e9ad9dbcc99f55b5a858775" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_ff5c43e186f7faf15a975004d76" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_697909a55bde1b28a90560f3ae2" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_1c967c687096f071a18050f6e50" FOREIGN KEY ("subCategory_id") REFERENCES "sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_1c967c687096f071a18050f6e50"`)
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_697909a55bde1b28a90560f3ae2"`)
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ff5c43e186f7faf15a975004d76"`)
    await queryRunner.query(
      `ALTER TABLE "event_details" DROP CONSTRAINT "FK_c760e9ad9dbcc99f55b5a858775"`
    )
    await queryRunner.query(`DROP TABLE "event"`)
    await queryRunner.query(`DROP TYPE "public"."event_event_status_enum"`)
    await queryRunner.query(`DROP TABLE "event_details"`)
  }
}
