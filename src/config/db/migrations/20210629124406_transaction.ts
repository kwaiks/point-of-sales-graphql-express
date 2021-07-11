import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.withSchema("merchant").alterTable("transaction_detail", t => {
        t.double("price_discount").defaultTo(0)
    })

    await knex.schema.withSchema("merchant").alterTable("inventory_history", t => {
        t.double("price").unsigned().defaultTo(0);
    })

    await knex.schema.withSchema("merchant").raw(`
    CREATE FUNCTION merchant.create_invoice_number() 
        RETURNS TRIGGER 
        LANGUAGE PLPGSQL
    AS $$
    DECLARE
    _total  integer;
    _year   integer;
    _month  integer;
    BEGIN
        IF TG_OP = 'INSERT' THEN 
            SELECT date_part('year', NOW()) INTO _year;
            SELECT date_part('month', NOW()) INTO _month;
            SELECT (COALESCE((SELECT COUNT(*)
            FROM merchant.transaction 
            WHERE store_id = NEW.store_id
            AND date_part('year', created_at) = _year AND date_part('month', created_at) = _month), 0) + 1) INTO _total;

            NEW.invoice_no = 'INV-'|| _year || trim(TO_CHAR(_month,'00')) || trim(TO_CHAR(NEW.store_id, '0000')) || trim(TO_CHAR(_total, '0000'));
            RETURN NEW;
        END IF;
        RETURN NULL;
    END
    $$
    `)

    await knex.schema.withSchema("merchant").raw(`
        CREATE TRIGGER set_invoice_number
            BEFORE INSERT
            ON merchant.transaction
            FOR EACH ROW
                EXECUTE PROCEDURE merchant.create_invoice_number();
    `)

    await knex.schema.withSchema("merchant").raw(`
    CREATE FUNCTION merchant.reduce_inventory() 
        RETURNS TRIGGER 
        LANGUAGE PLPGSQL
    AS $$
    DECLARE
        _total  integer;
        _name   varchar;
        _price  numeric;
    BEGIN
        IF TG_OP = 'INSERT' THEN 
            SELECT stock, price, name INTO _total, _price, _name
            FROM merchant.inventory
            WHERE id = NEW.inventory_id
            LIMIT 1;
            IF NEW.type = 'reduction' or NEW.type = 'transaction' THEN
                IF (_total - NEW.total < 0) THEN 
                    RAISE EXCEPTION '% out of stock', _name;
                END IF;
                UPDATE merchant.inventory SET stock = (_total - NEW.total) WHERE id = NEW.inventory_id;
            ELSIF NEW.type = 'replenish' THEN
                UPDATE merchant.inventory SET stock = (_total + NEW.total) WHERE id = NEW.inventory_id;
            END IF;
            NEW.price = _price;
            RETURN NEW;
        END IF;
        RETURN NULL;
    END
    $$
    `)

    await knex.schema.withSchema("merchant").raw(`
        CREATE TRIGGER reduce_stock
            BEFORE INSERT
            ON merchant.inventory_history
            FOR EACH ROW
                EXECUTE PROCEDURE merchant.reduce_inventory();
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.withSchema("merchant").raw(`
        DROP TRIGGER IF EXISTS set_invoice_number ON merchant.transaction;
        DROP FUNCTION merchant.create_invoice_number();
        DROP TRIGGER IF EXISTS reduce_stock ON merchant.inventory_history;
        DROP FUNCTION merchant.reduce_inventory();
    `);

    await knex.schema.withSchema("merchant").alterTable("transaction_detail", t => {
        t.dropColumn("price_discount")
    })

    await knex.schema.withSchema("merchant").alterTable("inventory_history", t => {
        t.dropColumn("price");
    })
}

