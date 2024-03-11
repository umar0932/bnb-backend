import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateRatingsTable1710190885043 implements MigrationInterface {
  name = 'CreateRatingsTable1710190885043'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ratings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "event_id" uuid,
        "customer_id" uuid,
        "organizer_rating" numeric NOT NULL,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "customer_user" ADD "average_rating" numeric`)
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_b4b9de806b24e78afc2aceec379" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "FK_5fa7f86e5e2fb9dbf03c276c1f3" FOREIGN KEY ("customer_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_5fa7f86e5e2fb9dbf03c276c1f3"`
    )
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_b4b9de806b24e78afc2aceec379"`
    )
    await queryRunner.query(`ALTER TABLE "customer_user" DROP COLUMN "average_rating"`)
    await queryRunner.query(`DROP TABLE "ratings"`)
  }
}
