import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddColumnTicketsSoldAndGrossTotalInEventAndTickets1710745279650
  implements MigrationInterface
{
  name = 'AddColumnTicketsSoldAndGrossTotalInEventAndTickets1710745279650'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tickets" ADD "tickets_sold" bigint NOT NULL DEFAULT '0'`)
    await queryRunner.query(`ALTER TABLE "tickets" ADD "gross_total" bigint NOT NULL DEFAULT '0'`)
    await queryRunner.query(`ALTER TABLE "tickets" ADD "customer_id" uuid`)
    await queryRunner.query(`ALTER TABLE "event" ADD "tickets_sold" bigint NOT NULL DEFAULT '0'`)
    await queryRunner.query(`ALTER TABLE "event" ADD "gross_total" bigint NOT NULL DEFAULT '0'`)
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_42e4343476d9c4a46fb565a5c46" FOREIGN KEY ("customer_id") REFERENCES "customer_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_42e4343476d9c4a46fb565a5c46"`
    )
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "gross_total"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "tickets_sold"`)
    await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "customer_id"`)
    await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "gross_total"`)
    await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "tickets_sold"`)
  }
}
