import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("merchant.users").del();

    // Inserts seed entries
    await knex("table_name").insert(
        { 
            email: "store@store.com", 
            password: "pass1234" ,
            phone: "+62626262111",
            firstName: "Store User"
        });
};
