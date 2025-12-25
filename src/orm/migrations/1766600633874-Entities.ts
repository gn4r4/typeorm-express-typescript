import {MigrationInterface, QueryRunner} from "typeorm";

export class Entities1766600633874 implements MigrationInterface {
    name = 'Entities1766600633874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reader" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name")
        `);
        await queryRunner.query(`
            ALTER TABLE "genre"
            ADD CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name")
        `);
        await queryRunner.query(`
            ALTER TABLE "cabinet"
            ADD CONSTRAINT "UQ_1dd96f96ca6350a85f387e82765" UNIQUE ("name")
        `);
        await queryRunner.query(`
            ALTER TABLE "shelf"
            ADD CONSTRAINT "UQ_759be3dc406bd5a5af3e314ef70" UNIQUE ("shelfcode")
        `);
        await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_f9c8579236159349f1635a7afbb"
        `);
        await queryRunner.query(`
            ALTER TABLE "orders"
            ALTER COLUMN "id_supplier"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_f9c8579236159349f1635a7afbb" FOREIGN KEY ("id_supplier") REFERENCES "supplier"("id_supplier") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_f9c8579236159349f1635a7afbb"
        `);
        await queryRunner.query(`
            ALTER TABLE "orders"
            ALTER COLUMN "id_supplier" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_f9c8579236159349f1635a7afbb" FOREIGN KEY ("id_supplier") REFERENCES "supplier"("id_supplier") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "shelf" DROP CONSTRAINT "UQ_759be3dc406bd5a5af3e314ef70"
        `);
        await queryRunner.query(`
            ALTER TABLE "cabinet" DROP CONSTRAINT "UQ_1dd96f96ca6350a85f387e82765"
        `);
        await queryRunner.query(`
            ALTER TABLE "genre" DROP CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c"
        `);
        await queryRunner.query(`
            ALTER TABLE "category" DROP CONSTRAINT "UQ_23c05c292c439d77b0de816b500"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee"
            ADD "user_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "reader"
            ADD "user_id" integer
        `);
    }

}
