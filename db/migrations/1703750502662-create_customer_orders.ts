import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCustomerOrders1703750502662 implements MigrationInterface {
  name = 'CreateCustomerOrders1703750502662'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_order_status_enum" AS ENUM('pending', 'failed', 'succeeded')`
    )
    await queryRunner.query(
      `CREATE TABLE "orders" ( 
        "idOrder" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "event_id" integer NOT NULL, 
        "payment_intent_id" character varying NOT NULL, 
        "stripe_customer_id" character varying NOT NULL, 
        "total_price" numeric NOT NULL DEFAULT '0', 
        "tickets_json" text NOT NULL, 
        "order_status" "public"."orders_order_status_enum" NOT NULL DEFAULT 'pending', 
        "created_by" character varying(50) NOT NULL DEFAULT 'system', 
        "updated_by" character varying(50) DEFAULT 'system', 
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fa5bb35242a2964529a73095c74" PRIMARY KEY ("idOrder"))`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_user" ADD "stripe_customer_id" character varying(200)`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e9d0d27c3aa5ac4bebc070c595" ON "customer_user" ("email") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_e9d0d27c3aa5ac4bebc070c595"`)
    await queryRunner.query(`ALTER TABLE "customer_user" DROP COLUMN "stripe_customer_id"`)
    await queryRunner.query(`DROP TABLE "orders"`)
    await queryRunner.query(`DROP TYPE "public"."orders_order_status_enum"`)
  }
}
