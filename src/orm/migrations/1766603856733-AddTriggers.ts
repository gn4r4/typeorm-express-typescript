import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTriggers1766603856733 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // =========================================================
        // 1. ОНОВЛЕННЯ СТАТУСУ ПРИ ВИДАЧІ (Lending -> Copybook)
        // =========================================================
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_copybook_issue()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE "copybook"
                SET status = 'виданий'
                WHERE id_copybook = NEW.id_copybook;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER trg_copybook_issue
            AFTER INSERT ON "lending_copybook"
            FOR EACH ROW
            EXECUTE FUNCTION func_copybook_issue();
        `);

        // =========================================================
        // 2. ОНОВЛЕННЯ СТАТУСУ ПРИ ПОВЕРНЕННІ (Lending -> Copybook)
        // =========================================================
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_copybook_return()
            RETURNS TRIGGER AS $$
            BEGIN
                IF OLD.datereturn_actual IS NULL AND NEW.datereturn_actual IS NOT NULL THEN
                    UPDATE "copybook"
                    SET status = 'доступний'
                    WHERE id_copybook = NEW.id_copybook;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER trg_copybook_return
            AFTER UPDATE ON "lending_copybook"
            FOR EACH ROW
            EXECUTE FUNCTION func_copybook_return();
        `);

        // =========================================================
        // 3. ЗАПОБІГАННЯ ВИДАЧІ НЕДОСТУПНОЇ КНИГИ
        // =========================================================
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_prevent_double_lending()
            RETURNS TRIGGER AS $$
            DECLARE 
                current_status VARCHAR(50);
            BEGIN
                SELECT status INTO current_status
                FROM "copybook"
                WHERE id_copybook = NEW.id_copybook;
                
                IF current_status != 'доступний' THEN
                    RAISE EXCEPTION 'Помилка: Ця книга (ID: %) зараз недоступна (статус: %).', NEW.id_copybook, current_status;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER trg_prevent_double_lending
            BEFORE INSERT ON "lending_copybook"
            FOR EACH ROW
            EXECUTE FUNCTION func_prevent_double_lending();
        `);

        // =========================================================
        // 4. АВТО-ЗАКРИТТЯ ЗАГАЛЬНОЇ ВИДАЧІ
        // =========================================================
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

        await queryRunner.query(`
            CREATE TRIGGER trg_close_lending_record
            AFTER UPDATE ON "lending_copybook"
            FOR EACH ROW
            EXECUTE FUNCTION func_close_lending_record();
        `);

        // =========================================================
        // 5. ВАЛІДАЦІЯ ДАТ (Повернення >= Видача)
        // =========================================================
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
            CREATE TRIGGER trg_validate_dates
            BEFORE UPDATE ON "lending"
            FOR EACH ROW
            EXECUTE FUNCTION func_validate_dates();
        `);

        // =========================================================
        // 6. ЗАБОРОНА ЗМІНИ ВИКОНАНИХ ЗАМОВЛЕНЬ (Orders)
        // =========================================================
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_freeze_completed_orders()
            RETURNS TRIGGER AS $$
            DECLARE 
                order_status VARCHAR(50);
            BEGIN
                SELECT status INTO order_status
                FROM "orders"
                WHERE id_order = OLD.id_order;

                IF order_status IN ('Отримано', 'Завершено') THEN
                    RAISE EXCEPTION 'Заборонено: Не можна змінювати склад вже виконаного замовлення (ID: %).', OLD.id_order;
                END IF;
                
                -- Важливо! Для DELETE тригера повертаємо OLD, інакше видалення не відбудеться навіть якщо немає помилки
                RETURN OLD;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER trg_freeze_completed_orders
            BEFORE DELETE ON "order_edition"
            FOR EACH ROW
            EXECUTE FUNCTION func_freeze_completed_orders();
        `);

        // =========================================================
        // 7. ПОВЕРНЕННЯ ВСІХ КНИГ ОДНОЧАСНО (Lending -> Lending_Copybook)
        // =========================================================
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION func_lending_bulk_return()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Якщо дату повернення встановлено (і раніше її не було)
                IF OLD.datereturn IS NULL AND NEW.datereturn IS NOT NULL THEN
                    
                    -- Оновлюємо фактичну дату повернення для всіх книг цього замовлення,
                    -- які ще не були позначені як повернуті.
                    UPDATE "lending_copybook"
                    SET datereturn_actual = NEW.datereturn
                    WHERE id_lending = NEW.id_lending 
                      AND datereturn_actual IS NULL;
                      
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER trg_lending_bulk_return
            AFTER UPDATE ON "lending"
            FOR EACH ROW
            EXECUTE FUNCTION func_lending_bulk_return();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Видалення тригерів
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_copybook_issue ON "lending_copybook"`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_copybook_return ON "lending_copybook"`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_prevent_double_lending ON "lending_copybook"`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_close_lending_record ON "lending_copybook"`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_validate_dates ON "lending"`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_freeze_completed_orders ON "order_edition"`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_lending_bulk_return ON "lending"`);
        
        // Видалення функцій
        await queryRunner.query(`DROP FUNCTION IF EXISTS func_copybook_issue`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS func_copybook_return`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS func_prevent_double_lending`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS func_close_lending_record`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS func_validate_dates`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS func_freeze_completed_orders`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS func_lending_bulk_return`);
    }
}