// Update with your config settings.
import { knexSnakeCaseMappers } from "objection";
import dotenv from "dotenv";

if(process.env.MIGRATION){
  dotenv.config({path: "../.env"});
}else{
  dotenv.config();
}

export default {
    client: "pg",
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + "/config/db/migrations",
      tableName: "mesan_migrations"
    },
    seeds: {
      directory: __dirname + "/config/db/seeds",
    },
    ...knexSnakeCaseMappers()
};
