import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserAdminTable1701351612867 implements MigrationInterface {
  name = 'CreateUserAdminTable1701351612867'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin_user" (
        "idAdminUser" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "email" character varying(50) NOT NULL, "first_name" character varying(50) NOT NULL, 
        "last_name" character varying(50) NOT NULL, "password" character varying NOT NULL, 
        "is_active" boolean DEFAULT true, 
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_840ac5cd67be99efa5cd989bf9f" UNIQUE ("email"),
        CONSTRAINT "PK_8ff51739a822a76e6b3e78c02da" PRIMARY KEY ("idAdminUser"))`
    )
    await queryRunner.query(
      `CREATE TABLE "customer_user" ( 
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "email" character varying(50) NOT NULL, 
        "first_name" character varying(50) NOT NULL, 
        "last_name" character varying(50) NOT NULL, 
        "password" character varying NOT NULL, 
        "home_phone" character varying(20), 
        "cell_phone" character varying(20), 
        "job_title" character varying(50), 
        "company_name" character varying(50), 
        "website" character varying,
        "first_address" character varying, 
        "second_address" character varying, 
        "city" character varying(50), 
        "country" character varying(50), 
        "zip_code" character varying(50), 
        "state" character varying(50), 
        "is_active" boolean DEFAULT true,
        "created_by" character varying(50) NOT NULL DEFAULT 'system', 
        "updated_by" character varying(50) DEFAULT 'system', 
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        CONSTRAINT "UQ_e9d0d27c3aa5ac4bebc070c595b" UNIQUE ("email"), 
        CONSTRAINT "PK_5d1f609371a285123294fddcf3a" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customer_user"`)
    await queryRunner.query(`DROP TABLE "admin_user"`)
  }
}
