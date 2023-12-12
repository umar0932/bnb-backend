import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBasicEvent1702365386809 implements MigrationInterface {
  name = 'CreateBasicEvent1702365386809'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT "FK_4ec8c495300259f2322760a39fa"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."location_location_type_enum" AS ENUM('ONLINE_EVENT', 'VENUE_EVENT')`
    )
    await queryRunner.query(
      `CREATE TABLE "location" (
        "idLocation" SERIAL NOT NULL, 
        "venue_name" character varying NOT NULL, 
        "street_address" character varying NOT NULL, 
        "country" character varying(70) NOT NULL, 
        "city" character varying(70) NOT NULL, 
        "state" character varying(70), 
        "postalCode" character varying(10) NOT NULL, 
        "lat" character varying(50) NOT NULL, 
        "long" character varying(50) NOT NULL, 
        "location_type" "public"."location_location_type_enum" NOT NULL, 
        "placeId" character varying(100), 
        CONSTRAINT "PK_9f31ebb0745a154dcbb6ebba39c" PRIMARY KEY ("idLocation"))`
    )
    await queryRunner.query(
      `CREATE TABLE "event" (
        "idEvent" SERIAL NOT NULL, 
        "event_title" character varying(50) NOT NULL, 
        "tags" text, 
        "type" character varying(50), 
        "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, 
        "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, 
        "ref_id_location" integer,
        "created_by" character varying(50) NOT NULL DEFAULT 'system', 
        "updated_by" character varying(50) DEFAULT 'system', 
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        CONSTRAINT "UQ_71704e8727ca8580eb7b4e52937" UNIQUE ("event_title"), 
        CONSTRAINT "REL_982e5171b6f0a10e2efdaa06ec" UNIQUE ("ref_id_location"), 
        CONSTRAINT "PK_8584a543408e35042b22facbb68" PRIMARY KEY ("idEvent"))`
    )
    await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "category_id"`)
    await queryRunner.query(`ALTER TABLE "category" ADD "ref_id_event" integer`)
    await queryRunner.query(`ALTER TABLE "sub_category" ADD "ref_id_category" integer`)
    await queryRunner.query(`ALTER TABLE "sub_category" ADD "ref_id_event" integer`)
    await queryRunner.query(
      `ALTER TABLE "organizer_user" DROP CONSTRAINT "UQ_8c0ecbf21fb0cd918c7b66de826"`
    )
    await queryRunner.query(`ALTER TABLE "organizer_user" DROP COLUMN "name"`)
    await queryRunner.query(
      `ALTER TABLE "organizer_user" ADD "name" character varying(100) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "organizer_user" ADD CONSTRAINT "UQ_8c0ecbf21fb0cd918c7b66de826" UNIQUE ("name")`
    )
    await queryRunner.query(`ALTER TABLE "organizer_user" DROP COLUMN "description"`)
    await queryRunner.query(`ALTER TABLE "organizer_user" ADD "description" character varying(500)`)
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_982e5171b6f0a10e2efdaa06ec7" FOREIGN KEY ("ref_id_location") REFERENCES "location"("idLocation") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_f2617c96911a100518775c3330f" FOREIGN KEY ("ref_id_event") REFERENCES "event"("idEvent") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_1c21f949319fc1ae4c36d36afc2" FOREIGN KEY ("ref_id_category") REFERENCES "category"("idCategory") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_e78d0ebbfb5a9c368cc096dd0e8" FOREIGN KEY ("ref_id_event") REFERENCES "event"("idEvent") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT "FK_e78d0ebbfb5a9c368cc096dd0e8"`
    )
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT "FK_1c21f949319fc1ae4c36d36afc2"`
    )
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_f2617c96911a100518775c3330f"`
    )
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_982e5171b6f0a10e2efdaa06ec7"`)
    await queryRunner.query(`ALTER TABLE "organizer_user" DROP COLUMN "description"`)
    await queryRunner.query(`ALTER TABLE "organizer_user" ADD "description" character varying`)
    await queryRunner.query(
      `ALTER TABLE "organizer_user" DROP CONSTRAINT "UQ_8c0ecbf21fb0cd918c7b66de826"`
    )
    await queryRunner.query(`ALTER TABLE "organizer_user" DROP COLUMN "name"`)
    await queryRunner.query(
      `ALTER TABLE "organizer_user" ADD "name" character varying(500) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "organizer_user" ADD CONSTRAINT "UQ_8c0ecbf21fb0cd918c7b66de826" UNIQUE ("name")`
    )
    await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "ref_id_event"`)
    await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "ref_id_category"`)
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "ref_id_event"`)
    await queryRunner.query(`ALTER TABLE "sub_category" ADD "category_id" integer`)
    await queryRunner.query(`DROP TABLE "event"`)
    await queryRunner.query(`DROP TABLE "location"`)
    await queryRunner.query(`DROP TYPE "public"."location_location_type_enum"`)
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_4ec8c495300259f2322760a39fa" FOREIGN KEY ("category_id") REFERENCES "category"("idCategory") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }
}
