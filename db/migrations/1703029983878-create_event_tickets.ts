import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateEventTickets1703029983878 implements MigrationInterface {
  name = 'CreateEventTickets1703029983878'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_details" DROP CONSTRAINT "FK_251bc53af940a0e8b1bd829527b"`
    )
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_6efa3d0668460cd0e47fdb09f48"`)
    await queryRunner.query(
      `ALTER TABLE "sub_category" DROP CONSTRAINT "FK_e78d0ebbfb5a9c368cc096dd0e8"`
    )
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_f2617c96911a100518775c3330f"`
    )
    await queryRunner.query(
      `CREATE TABLE "event_ticket" ( 
        "idEventTicket" SERIAL NOT NULL, "ticket_name" character varying(50) NOT NULL, 
        "available_quantity" integer NOT NULL, "ticket_price" numeric NOT NULL, 
        "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, 
        "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, 
        "description" character varying(50), 
        "is_visible" boolean DEFAULT true, 
        "minimum_quantity" integer NOT NULL, 
        "maximum_quantity" integer NOT NULL,
        "created_by" character varying(50) NOT NULL DEFAULT 'system', 
        "updated_by" character varying(50) DEFAULT 'system', 
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "ref_id_event" integer, CONSTRAINT "PK_04cf9e0114d07b55787f1291ce4" PRIMARY KEY ("idEventTicket"))`
    )
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "UQ_6efa3d0668460cd0e47fdb09f48"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "ref_id_event_details"`)
    await queryRunner.query(`ALTER TABLE "sub_category" DROP COLUMN "ref_id_event"`)
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "ref_id_event"`)
    await queryRunner.query(`ALTER TABLE "event" ADD "ref_id_category" integer`)
    await queryRunner.query(`ALTER TABLE "event" ADD "ref_id_subCategory" integer`)
    await queryRunner.query(
      `ALTER TABLE "event_details" ADD CONSTRAINT "FK_251bc53af940a0e8b1bd829527b" FOREIGN KEY ("ref_id_event") REFERENCES "event"("idEvent") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event_ticket" ADD CONSTRAINT "FK_350ca5d9818fd363306609f8762" FOREIGN KEY ("ref_id_event") REFERENCES "event"("idEvent") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_3df81b8f6ee03223215a18d2a05" FOREIGN KEY ("ref_id_category") REFERENCES "category"("idCategory") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_4b4db172a9f3046284be0932f68" FOREIGN KEY ("ref_id_subCategory") REFERENCES "sub_category"("idSubCategory") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_4b4db172a9f3046284be0932f68"`)
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_3df81b8f6ee03223215a18d2a05"`)
    await queryRunner.query(
      `ALTER TABLE "event_ticket" DROP CONSTRAINT "FK_350ca5d9818fd363306609f8762"`
    )
    await queryRunner.query(
      `ALTER TABLE "event_details" DROP CONSTRAINT "FK_251bc53af940a0e8b1bd829527b"`
    )
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "ref_id_subCategory"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "ref_id_category"`)
    await queryRunner.query(`ALTER TABLE "category" ADD "ref_id_event" integer`)
    await queryRunner.query(`ALTER TABLE "sub_category" ADD "ref_id_event" integer`)
    await queryRunner.query(`ALTER TABLE "event" ADD "ref_id_event_details" integer`)
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "UQ_6efa3d0668460cd0e47fdb09f48" UNIQUE ("ref_id_event_details")`
    )
    await queryRunner.query(`DROP TABLE "event_ticket"`)
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_f2617c96911a100518775c3330f" FOREIGN KEY ("ref_id_event") REFERENCES "event"("idEvent") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sub_category" ADD CONSTRAINT "FK_e78d0ebbfb5a9c368cc096dd0e8" FOREIGN KEY ("ref_id_event") REFERENCES "event"("idEvent") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_6efa3d0668460cd0e47fdb09f48" FOREIGN KEY ("ref_id_event_details") REFERENCES "event_details"("idEventDetails") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event_details" ADD CONSTRAINT "FK_251bc53af940a0e8b1bd829527b" FOREIGN KEY ("ref_id_event") REFERENCES "event"("idEvent") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
