import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSocialProviderTable1709021890962 implements MigrationInterface {
  name = 'CreateSocialProviderTable1709021890962'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."social_provider_social_provider_enum" AS ENUM('google', 'facebook')`
    )
    await queryRunner.query(
      `CREATE TABLE "social_provider" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "social_provider" "public"."social_provider_social_provider_enum" NOT NULL,
        "socialId" character varying NOT NULL,
        "customer_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_11c163e15c0f61964953efc47eb" UNIQUE ("socialId"),
        CONSTRAINT "REL_9fc14f13d814ab10af08bb44e8" UNIQUE ("customer_id"),
        CONSTRAINT "PK_27f0b9006e0c7a2779e77a68298" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "social_provider" ADD CONSTRAINT "FK_9fc14f13d814ab10af08bb44e8c" FOREIGN KEY ("customer_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "social_provider" DROP CONSTRAINT "FK_9fc14f13d814ab10af08bb44e8c"`
    )
    await queryRunner.query(`DROP TABLE "social_provider"`)
    await queryRunner.query(`DROP TYPE "public"."social_provider_social_provider_enum"`)
  }
}
