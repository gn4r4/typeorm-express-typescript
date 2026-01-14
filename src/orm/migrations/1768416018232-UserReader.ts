import {MigrationInterface, QueryRunner} from "typeorm";

export class UserReader1768416018232 implements MigrationInterface {
    name = 'UserReader1768416018232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reader"
            ADD "id_user" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "reader"
            ADD CONSTRAINT "UQ_019e68891e87b8b0edac11fcee9" UNIQUE ("id_user")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role"
            SET DEFAULT 'READER'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "language"
            SET DEFAULT 'uk-UA'
        `);
        await queryRunner.query(`
            ALTER TABLE "reader"
            ADD CONSTRAINT "FK_019e68891e87b8b0edac11fcee9" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reader" DROP CONSTRAINT "FK_019e68891e87b8b0edac11fcee9"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "language"
            SET DEFAULT 'en-US'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role"
            SET DEFAULT 'STANDARD'
        `);
        await queryRunner.query(`
            ALTER TABLE "reader" DROP CONSTRAINT "UQ_019e68891e87b8b0edac11fcee9"
        `);
        await queryRunner.query(`
            ALTER TABLE "reader" DROP COLUMN "id_user"
        `);
    }

}
