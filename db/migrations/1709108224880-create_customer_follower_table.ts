import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCustomerFollowerTable1709108224880 implements MigrationInterface {
  name = 'CreateCustomerFollowerTable1709108224880'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customer_followers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "follower_id" uuid,
        "following_id" uuid,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_8e55b9b60290a4d6226a9385f0b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_user" ADD "following_count" numeric NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_user" ADD "followers_count" numeric NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_followers" ADD CONSTRAINT "FK_e27a557a6ba1ded60addb576924" FOREIGN KEY ("follower_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_followers" ADD CONSTRAINT "FK_e0acf1bc947d192fcd7c5fba789" FOREIGN KEY ("following_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_followers" DROP CONSTRAINT "FK_e0acf1bc947d192fcd7c5fba789"`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_followers" DROP CONSTRAINT "FK_e27a557a6ba1ded60addb576924"`
    )
    await queryRunner.query(`ALTER TABLE "customer_user" DROP COLUMN "followers_count"`)
    await queryRunner.query(`ALTER TABLE "customer_user" DROP COLUMN "following_count"`)
    await queryRunner.query(`DROP TABLE "customer_followers"`)
  }
}
