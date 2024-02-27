import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAdminCustomerTable1709021083604 implements MigrationInterface {
  name = 'CreateAdminCustomerTable1709021083604'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(50) NOT NULL,
        "first_name" character varying(50) NOT NULL,
        "last_name" character varying(50) NOT NULL,
        "password" character varying NOT NULL,
        "profile_image" character varying(250),
        "is_active" boolean DEFAULT false,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"),
        CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "customer_user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(50) NOT NULL,
        "first_name" character varying(50) NOT NULL,
        "last_name" character varying(50) NOT NULL,
        "password" character varying NOT NULL,
        "profile_image" character varying(250),
        "city" character varying(50),
        "country" character varying(50),
        "job_title" character varying(50),
        "company_name" character varying(50),
        "home_phone" character varying(20),
        "cell_phone" character varying(20),
        "first_address" character varying,
        "second_address" character varying,
        "stripe_customer_id" character varying(200),
        "state" character varying(50),
        "website" character varying,
        "zip_code" character varying(50),
        "is_active" boolean DEFAULT false,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_e9d0d27c3aa5ac4bebc070c595b" UNIQUE ("email"),
        CONSTRAINT "UQ_decc660ee519e75b5fa705fe177" UNIQUE ("stripe_customer_id"),
        CONSTRAINT "PK_5d1f609371a285123294fddcf3a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e9d0d27c3aa5ac4bebc070c595" ON "customer_user" ("email") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_e9d0d27c3aa5ac4bebc070c595"`)
    await queryRunner.query(`DROP TABLE "customer_user"`)
    await queryRunner.query(`DROP TABLE "admin"`)
  }
}
