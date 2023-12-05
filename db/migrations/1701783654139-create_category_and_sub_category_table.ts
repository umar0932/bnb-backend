import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCategoryAndSubCategoryTable1701783654139 implements MigrationInterface {
  name = 'CreateCategoryAndSubCategoryTable1701783654139'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "sub_category" (
        "idSubCategory" SERIAL NOT NULL,
        "sub_category_name" character varying(50) NOT NULL,
        "category_id" integer,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_1c01ab5aaf12f6db608d98b0c46" UNIQUE ("sub_category_name"),
        CONSTRAINT "PK_55ad8f6eafefa88ae67aca75897" PRIMARY KEY ("idSubCategory")
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "category" (
        "idCategory" SERIAL NOT NULL,
        "category_name" character varying(50) NOT NULL,
        "created_by" character varying(50) NOT NULL DEFAULT 'system',
        "updated_by" character varying(50) DEFAULT 'system',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_9359e3b1d5e90d7a0fbe3b28077" UNIQUE ("category_name"),
        CONSTRAINT "PK_d5f5946ae6db014bb232949995c" PRIMARY KEY ("idCategory")
      )
    `)

    await queryRunner.query(`
        ALTER TABLE "sub_category"
        ADD CONSTRAINT "FK_4ec8c495300259f2322760a39fa"
        FOREIGN KEY ("category_id")
        REFERENCES "category"("idCategory")
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sub_category" DROP CONSTRAINT "FK_4ec8c495300259f2322760a39fa"
    `)

    await queryRunner.query(`DROP TABLE "category"`)
    await queryRunner.query(`DROP TABLE "sub_category"`)
  }
}
