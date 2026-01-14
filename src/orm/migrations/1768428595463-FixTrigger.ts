import {MigrationInterface, QueryRunner} from "typeorm";

export class FixTrigger1768428595463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // =========================================================
        // 1. ВИПРАВЛЕННЯ ВАЛІДАЦІЇ ДАТ (Ігноруємо час)
        // =========================================================
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_validate_dates()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.datereturn IS NOT NULL AND NEW.datereturn::DATE < NEW.datelending::DATE THEN
                    RAISE EXCEPTION 'Помилка: Дата повернення (%) не може бути раніше дати видачі (%).', NEW.datereturn, NEW.datelending;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // =========================================================
        // 2. ВИПРАВЛЕННЯ АВТО-ЗАКРИТТЯ (Запобігання рекурсії)
        // =========================================================
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_close_lending_record()
            RETURNS TRIGGER AS $$
            DECLARE 
                remaining_books INT;
                lending_closed DATE;
            BEGIN
                -- Спочатку перевіряємо, чи видача ВЖЕ закрита
                SELECT datereturn INTO lending_closed
                FROM "lending"
                WHERE id_lending = NEW.id_lending;

                -- Якщо дата повернення вже стоїть, нічого не робимо (розриваємо рекурсію)
                IF lending_closed IS NOT NULL THEN
                    RETURN NEW;
                END IF;

                -- Якщо видача ще відкрита, перевіряємо кількість книг
                SELECT COUNT(*) INTO remaining_books
                FROM "lending_copybook"
                WHERE id_lending = NEW.id_lending AND datereturn_actual IS NULL;

                IF remaining_books = 0 THEN
                    UPDATE "lending"
                    SET datereturn = CURRENT_DATE
                    WHERE id_lending = NEW.id_lending;
                END IF;
                
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_validate_dates()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.datereturn IS NOT NULL AND NEW.datereturn < NEW.datelending THEN
                    RAISE EXCEPTION 'Помилка: Дата повернення (%) не може бути раніше дати видачі (%).', NEW.datereturn, NEW.datelending;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_close_lending_record()
            RETURNS TRIGGER AS $$
            DECLARE 
                remaining_books INT;
            BEGIN
                SELECT COUNT(*) INTO remaining_books
                FROM "lending_copybook"
                WHERE id_lending = NEW.id_lending AND datereturn_actual IS NULL;

                IF remaining_books = 0 THEN
                    UPDATE "lending"
                    SET datereturn = CURRENT_DATE
                    WHERE id_lending = NEW.id_lending;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }
}