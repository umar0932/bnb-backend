import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCustomerTicketsTable1711090119147 implements MigrationInterface {
  name = 'CreateCustomerTicketsTable1711090119147'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_42e4343476d9c4a46fb565a5c46"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."customer_event_tickets_payment_type_enum" AS ENUM('ONLINE', 'CASH')`
    )
    await queryRunner.query(
      `CREATE TABLE "customer_event_tickets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "ticket_id" uuid,
        "event_id" uuid,
        "customer_id" uuid,
        "price" double precision NOT NULL DEFAULT '0',
        "is_checked_in" boolean DEFAULT false,
        "check_in_time" TIMESTAMP WITH TIME ZONE,
        "payment_type" "public"."customer_event_tickets_payment_type_enum" NOT NULL DEFAULT 'ONLINE',
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_726f155010c2607e1cc08679e3c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "customer_id"`)
    await queryRunner.query(
      `ALTER TYPE "public"."event_event_status_enum" RENAME TO "event_event_status_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."event_event_status_enum" AS ENUM('DRAFT', 'PUBLISHED')`
    )
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "event_status" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "event_status" TYPE "public"."event_event_status_enum" USING "event_status"::"text"::"public"."event_event_status_enum"`
    )
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "event_status" SET DEFAULT 'DRAFT'`)
    await queryRunner.query(`DROP TYPE "public"."event_event_status_enum_old"`)
    await queryRunner.query(
      `ALTER TABLE "customer_event_tickets" ADD CONSTRAINT "FK_b4776d1750a13522c39e2f7f26a" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_event_tickets" ADD CONSTRAINT "FK_1c81cb2c9296e052d1c300048d2" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_event_tickets" ADD CONSTRAINT "FK_1e4d4024b3f3887c01eaca39ea6" FOREIGN KEY ("customer_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_event_tickets" DROP CONSTRAINT "FK_1e4d4024b3f3887c01eaca39ea6"`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_event_tickets" DROP CONSTRAINT "FK_1c81cb2c9296e052d1c300048d2"`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_event_tickets" DROP CONSTRAINT "FK_b4776d1750a13522c39e2f7f26a"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."event_event_status_enum_old" AS ENUM('DRAFT', 'PUBLISHED', 'SOLD')`
    )
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "event_status" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "event_status" TYPE "public"."event_event_status_enum_old" USING "event_status"::"text"::"public"."event_event_status_enum_old"`
    )
    await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "event_status" SET DEFAULT 'DRAFT'`)
    await queryRunner.query(`DROP TYPE "public"."event_event_status_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."event_event_status_enum_old" RENAME TO "event_event_status_enum"`
    )
    await queryRunner.query(`ALTER TABLE "tickets" ADD "customer_id" uuid`)
    await queryRunner.query(`DROP TABLE "customer_event_tickets"`)
    await queryRunner.query(`DROP TYPE "public"."customer_event_tickets_payment_type_enum"`)
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_42e4343476d9c4a46fb565a5c46" FOREIGN KEY ("customer_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }
}
