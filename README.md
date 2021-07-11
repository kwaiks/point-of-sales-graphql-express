# POS Backend

Point of Sales application built with Express.js and GraphQL with JWT Authentication. Written in Typescript.

Using ORM library (Objection.js and knex) and PostgreSQL database.

## Features

- 1 User could have many stores.
- Menus have discount field.
- Transaction discount are created based on condition.
- If menu is using inventory, then inventory will reduce it's stock automatically when transaction are made.

## How To Start

- Create your own `.env` with `DB_NAME`,`DB_USER`,`DB_PASS`,`PRIVATE_KEY`,`PORT`
- Run `npm run migrate:latest` or `yarn migrate:latest`
- Run `npm run seed:run` or `yarn seed:run`
- Access GraphiQL by `localhost:PORT/gql`

## Commands

- `npm run migrate:latest` doing full migration
- `npm run migrate {name}` create **{name}** migration
- `npm run migrate:rollback` rollback to previous migration
- `npm run migrate:rollback --specific {name}` rollback specific migration
- `npm run test` run test
- `npm run seed {name}` create new seed **{name}**
- `npm run seed {name} --specific {name}.ts` run specific seed
- `npm run dev` run dev server
- `npm run build` compile project
- `npm run start` run server
