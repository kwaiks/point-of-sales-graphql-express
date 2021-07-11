import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createSchemaIfNotExists("internal");
    await knex.schema.createSchemaIfNotExists("merchant");

    await knex.schema.withSchema("internal").createTable("users", t => {
        t.bigIncrements("id").unsigned().primary();
        t.string("email").unique().notNullable();
        t.string("password").notNullable();
        t.string("name");
        t.string("photo_url");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    });

    await knex.schema.withSchema("merchant").createTable("users", t => {
        t.bigIncrements("id").unsigned().primary();
        t.string("email").unique().notNullable();
        t.string("password").notNullable();
        t.string("phone").unique().notNullable();
        t.string("first_name").notNullable();
        t.string("last_name");
        t.string("photo_url");
        t.boolean("is_verified").defaultTo(false);
        t.timestamp("verified_at");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    });

    await knex.schema.withSchema("merchant").createTable("user_verification", t => {
        t.uuid("id").primary().unique();
        t.bigInteger("user_id").references("id").inTable("merchant.users");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    })

    await knex.schema.withSchema("merchant").createTable("role_feature", t => {
        t.bigInteger("id").unsigned().primary();
        t.string("menu_name").unique();
    })

    await knex.schema.withSchema("merchant").createTable("employee_role", t => {
        t.string("id").unsigned().primary().unique();
        t.string("name").unique();
        t.bigInteger("role_feature_id").references("id").inTable("merchant.role_feature");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    })

    await knex.schema.withSchema("merchant").createTable("store", t => {
        t.bigIncrements("id").unsigned().primary();
        t.string("name").notNullable();
        t.string("phone");
        t.string("email");
        t.string("address");
        t.string("photo_url");
        t.string("description");
        t.boolean("isOpen").defaultTo(true);
        t.decimal("lat", 12, 8);
        t.decimal("lng", 12, 8);
        t.bigInteger("owner_id").references("id").inTable("merchant.users");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    });

    await knex.schema.withSchema("merchant").createTable("employee", t => {
        t.bigIncrements("id").primary().unsigned();
        t.bigInteger("store_id").references("id").inTable("merchant.store");
        t.string("pass_code");
        t.string("name");
        t.string("role_id").references("id").inTable("merchant.employee_role");
    });


    await knex.schema.withSchema("merchant").createTable("menu", t => {
        t.bigIncrements("id").unsigned().primary();
        t.bigInteger("store_id").references("id").inTable("merchant.store");
        t.string("name");
        t.string("code");
        t.string("description");
        t.string("picture");
        t.integer("stock").unsigned().defaultTo(0);
        t.double("price").defaultTo(0);
        t.double("price_grab").defaultTo(0);
        t.double("price_gojek").defaultTo(0);
        t.boolean("is_discount").defaultTo(false);
        t.boolean("is_using_inventory").defaultTo(false);
        t.boolean("is_deleted").defaultTo(false);
        t.double("price_discount");
        t.enum("discount_type", ["fixed","percent"]);
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    })

    await knex.schema.withSchema("merchant").createTable("inventory", t => {
        t.bigIncrements("id").unsigned().primary();
        t.bigInteger("store_id").references("id").inTable("merchant.store");
        t.string("name");
        t.string("code");
        t.string("unit");
        t.integer("min_stock").unsigned().defaultTo(0);
        t.integer("stock").unsigned().defaultTo(0);
        t.double("price").defaultTo(0);
        t.boolean("is_deleted").defaultTo(false);
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    })

    await knex.schema.withSchema("merchant").createTable("inventory_history", t => {
        t.bigIncrements("id").unsigned().primary();
        t.bigInteger("inventory_id").references("id").inTable("merchant.inventory");
        t.bigInteger("menu_id").unsigned();
        t.string("description");
        t.integer("total");
        t.enum("type", ["replenish", "reduction", "transaction"]);
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    })

    await knex.schema.withSchema("merchant").createTable("menu_inventory", t => {
        t.bigIncrements("id").unsigned().primary();
        t.bigInteger("menu_id").references("id").inTable("merchant.menu");
        t.bigInteger("inventory_id").references("id").inTable("merchant.inventory");
        t.integer("total").unsigned().defaultTo(0);
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    })
    
    await knex.schema.withSchema("merchant").createTable("payment_method", t => {
        t.string("id").unique().primary();
        t.string("name").unique();
        t.enum("type", ["e-wallet", "cash", "va"]);
    })

    await knex.schema.withSchema("merchant").createTable("transaction_type", t => {
        t.string("id").unique().primary();
        t.string("name").notNullable();
    })

    await knex.schema.withSchema("merchant").createTable("transaction", t => {
        t.bigIncrements("id").primary().unsigned();
        t.bigInteger("store_id").references("id").inTable("merchant.store");
        t.string("transaction_type_id").references("id").inTable("merchant.transaction_type");
        t.string("cust_name");
        t.string("invoice_no").unique().notNullable();
        t.double("subtotal").notNullable();
        t.double("discount_total").defaultTo(0);
        t.string("note");
        t.double("total").notNullable();
        t.double("changes").defaultTo(0);
        t.double("paid").notNullable();
        t.string("payment_method_id").references("id").inTable("merchant.payment_method");
        t.bigInteger("employee_id").references("id").inTable("merchant.employee");
        t.timestamp("created_at").defaultTo(knex.fn.now());
    });

    await knex.schema.withSchema("merchant").createTable("transaction_detail", t => {
        t.bigIncrements("id").primary().unsigned();
        t.bigInteger("transaction_id").references("id").inTable("merchant.transaction");
        t.bigInteger("menu_id").references("id").inTable("merchant.menu");
        t.integer("qty").unsigned().notNullable();
        t.string("name").notNullable();
        t.double("price").notNullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
    })

    await knex.schema.withSchema("public").createTable("users", t => {
        t.bigIncrements("id").unsigned().primary();
        t.string("email").unique().notNullable();
        t.string("password").notNullable();
        t.string("phone").unique().notNullable();
        t.string("first_name").notNullable();
        t.string("last_name");
        t.string("photo_url");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at");
    });

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropSchemaIfExists("internal");
    await knex.schema.dropSchemaIfExists("merchant");
    await knex.schema.dropTable("users");
}

