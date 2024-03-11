import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEventAndCustomerRelationalInOrders1710237738216 implements MigrationInterface {
  name = 'AddEventAndCustomerRelationalInOrders1710237738216'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "customer_id" uuid`)
    await queryRunner.query(`ALTER TABLE "event" ADD "meeting_url" character varying(255)`)
    await queryRunner.query(
      `CREATE TYPE "public"."event_event_location_type_enum" AS ENUM('online', 'onsite')`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD "event_location_type" "public"."event_event_location_type_enum" NOT NULL DEFAULT 'onsite'`
    )
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "event_id"`)
    await queryRunner.query(`ALTER TABLE "orders" ADD "event_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_642ca308ac51fea8327e593b8ab" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`)
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_642ca308ac51fea8327e593b8ab"`)
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "event_id"`)
    await queryRunner.query(`ALTER TABLE "orders" ADD "event_id" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "event_location_type"`)
    await queryRunner.query(`DROP TYPE "public"."event_event_location_type_enum"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "meeting_url"`)
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_id"`)
  }
}
