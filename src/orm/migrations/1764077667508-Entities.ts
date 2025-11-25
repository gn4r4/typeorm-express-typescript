import {MigrationInterface, QueryRunner} from "typeorm";

export class Entities1764077667508 implements MigrationInterface {
    name = 'Entities1764077667508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id_category" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                CONSTRAINT "PK_9cfdf8d215b7072d300b9bbcafe" PRIMARY KEY ("id_category")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "genre" (
                "id_genre" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                CONSTRAINT "PK_8026c75a57b30a4aaf4e1738c95" PRIMARY KEY ("id_genre")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "book" (
                "id_book" SERIAL NOT NULL,
                "title" character varying(255) NOT NULL,
                "id_category" integer NOT NULL,
                "id_genre" integer NOT NULL,
                CONSTRAINT "PK_f3be146aba69d9b18a6f68bf852" PRIMARY KEY ("id_book")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "book_author" (
                "id_book" integer NOT NULL,
                "id_author" integer NOT NULL,
                CONSTRAINT "PK_4ea00d2508cbcecd7b88737dcf2" PRIMARY KEY ("id_book", "id_author")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "author" (
                "id_author" SERIAL NOT NULL,
                "lastname" character varying(50) NOT NULL,
                "firstname" character varying(50) NOT NULL,
                "patronymic" character varying(50),
                "dateofbirth" date,
                CONSTRAINT "PK_581289fa9ff3a0ce6e21eebb693" PRIMARY KEY ("id_author")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "book"
            ADD CONSTRAINT "FK_9873ad1236e24ac59409841a485" FOREIGN KEY ("id_category") REFERENCES "category"("id_category") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "book"
            ADD CONSTRAINT "FK_b78750954cb0e7b06d3744f75ed" FOREIGN KEY ("id_genre") REFERENCES "genre"("id_genre") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "book_author"
            ADD CONSTRAINT "FK_5566a1a1422c12b207d043f980f" FOREIGN KEY ("id_book") REFERENCES "book"("id_book") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "book_author"
            ADD CONSTRAINT "FK_426dad9a5c053976d6f835e8c26" FOREIGN KEY ("id_author") REFERENCES "author"("id_author") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "book_author" DROP CONSTRAINT "FK_426dad9a5c053976d6f835e8c26"
        `);
        await queryRunner.query(`
            ALTER TABLE "book_author" DROP CONSTRAINT "FK_5566a1a1422c12b207d043f980f"
        `);
        await queryRunner.query(`
            ALTER TABLE "book" DROP CONSTRAINT "FK_b78750954cb0e7b06d3744f75ed"
        `);
        await queryRunner.query(`
            ALTER TABLE "book" DROP CONSTRAINT "FK_9873ad1236e24ac59409841a485"
        `);
        await queryRunner.query(`
            DROP TABLE "author"
        `);
        await queryRunner.query(`
            DROP TABLE "book_author"
        `);
        await queryRunner.query(`
            DROP TABLE "book"
        `);
        await queryRunner.query(`
            DROP TABLE "genre"
        `);
        await queryRunner.query(`
            DROP TABLE "category"
        `);
    }

}
