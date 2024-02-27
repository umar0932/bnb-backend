import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOrderTable1709028736941 implements MigrationInterface {
  name = 'CreateOrderTable1709028736941'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_order_status_enum" AS ENUM('pending', 'failed', 'succeeded')`
    )
    await queryRunner.query(
      `CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "event_id" character varying NOT NULL,
        "payment_intent_id" character varying NOT NULL,
        "stripe_customer_id" character varying NOT NULL,
        "total_price" double precision NOT NULL DEFAULT '0',
        "tickets_json" text NOT NULL,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "order_status" "public"."orders_order_status_enum" NOT NULL DEFAULT 'pending',
        CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orders"`)
    await queryRunner.query(`DROP TYPE "public"."orders_order_status_enum"`)
  }
}
