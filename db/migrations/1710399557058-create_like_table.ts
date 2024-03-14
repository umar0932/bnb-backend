import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateLikeTable1710399557058 implements MigrationInterface {
  name = 'CreateLikeTable1710399557058'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "likes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid,
        "event_id" uuid,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "event" ADD "like_count" bigint NOT NULL DEFAULT '0'`)
    await queryRunner.query(
      `ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "likes" ADD CONSTRAINT "FK_a05fbc4d12da60ccb27e19b4ed3" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_a05fbc4d12da60ccb27e19b4ed3"`)
    await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "like_count"`)
    await queryRunner.query(`DROP TABLE "likes"`)
  }
}
