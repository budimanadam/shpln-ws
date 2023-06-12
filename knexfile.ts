import 'dotenv/config'
import config from './src/config'
import type { Knex } from "knex";

// Update with your config settings.

const knexConfig: { [key: string]: Knex.Config } = {
  local: {
    client: "postgresql",
    connection: {
      database: config.SYSTEM_DB,
      host: config.SYSTEM_DB_HOST,
      user: config.SYSTEM_DB_USER,
      password: config.SYSTEM_DB_PASSWORD,
      port: config.SYSTEM_DB_PORT,
      pool: {
        max: 10,
        min: 2
      }
    },
  },

  development: {
    client: "postgresql",
    connection: {
      database: config.SYSTEM_DB,
      host: config.SYSTEM_DB_HOST,
      user: config.SYSTEM_DB_USER,
      password: config.SYSTEM_DB_PASSWORD,
      port: config.SYSTEM_DB_PORT,
      pool: {
        max: 10,
        min: 2
      }
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};

export default knexConfig;
