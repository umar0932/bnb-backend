import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSocialProvider1704289995995 implements MigrationInterface {
  name = 'CreateSocialProvider1704289995995'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."social_provider_social_provider_enum" AS ENUM('google', 'facebook')`
    )
    await queryRunner.query(
      `CREATE TABLE "social_provider" (
        "id" SERIAL NOT NULL, 
        "social_provider" "public"."social_provider_social_provider_enum" NOT NULL, 
        "socialId" character varying NOT NULL, 
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "ref_id_customer" uuid, 
        CONSTRAINT "UQ_11c163e15c0f61964953efc47eb" UNIQUE ("socialId"),
        CONSTRAINT "REL_9fc14f13d814ab10af08bb44e8" UNIQUE ("ref_id_customer"),
        CONSTRAINT "PK_27f0b9006e0c7a2779e77a68298" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "customer_user" ADD "mediaUrl" character varying(250)`)
    await queryRunner.query(
      `ALTER TABLE "customer_user" ADD CONSTRAINT "UQ_decc660ee519e75b5fa705fe177" UNIQUE ("stripe_customer_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "social_provider" ADD CONSTRAINT "FK_9fc14f13d814ab10af08bb44e8c" FOREIGN KEY ("ref_id_customer") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "social_provider" DROP CONSTRAINT "FK_9fc14f13d814ab10af08bb44e8c"`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_user" DROP CONSTRAINT "UQ_decc660ee519e75b5fa705fe177"`
    )
    await queryRunner.query(`ALTER TABLE "customer_user" DROP COLUMN "mediaUrl"`)
    await queryRunner.query(`DROP TABLE "social_provider"`)
    await queryRunner.query(`DROP TYPE "public"."social_provider_social_provider_enum"`)
  }
}
