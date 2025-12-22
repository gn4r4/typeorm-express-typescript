import {MigrationInterface, QueryRunner} from "typeorm";

export class newEntities1766259798458 implements MigrationInterface {
    name = 'newEntities1766259798458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "copybook_location" DROP CONSTRAINT "FK_860333057129ed1195ded17c817"
        `);
        await queryRunner.query(`
            ALTER TABLE "copybook_location"
            ALTER COLUMN "id_copybook" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "copybook_location"
            ADD CONSTRAINT "FK_860333057129ed1195ded17c817" FOREIGN KEY ("id_copybook") REFERENCES "copybook"("id_copybook") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "copybook_location" DROP CONSTRAINT "FK_860333057129ed1195ded17c817"
        `);
        await queryRunner.query(`
            ALTER TABLE "copybook_location"
            ALTER COLUMN "id_copybook"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "copybook_location"
            ADD CONSTRAINT "FK_860333057129ed1195ded17c817" FOREIGN KEY ("id_copybook") REFERENCES "copybook"("id_copybook") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
