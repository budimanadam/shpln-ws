import config from '../config'

export interface DBConfig {
  client: string,
  connection: Connection
}

export interface Connection {
  user: string,
  password: string,
  host: string,
  port: number,
  database: string,
  poolsize?: number,
  max?: number,
  idleTimeoutMillis?: number
}

// Config for database system
const SystemDB: DBConfig = {
  client: 'pg',
  connection: {
    user: config.SYSTEM_DB_USER,
    password: config.SYSTEM_DB_PASSWORD,
    host: config.SYSTEM_DB_HOST,
    port: config.SYSTEM_DB_PORT,
    database: config.SYSTEM_DB,
    poolsize: 10,
    max: 10,
    idleTimeoutMillis: 30000,
  }
}

const TenantDB: DBConfig = {
  client: 'pg',
  connection: {
    user: config.TENANT_DB_USER,
    password: config.TENANT_DB_PASSWORD,
    host: config.TENANT_DB_HOST,
    port: config.TENANT_DB_PORT,
    database: config.TENANT_DB,
    poolsize: 10,
    max: 10,
    idleTimeoutMillis: 30000,
  }
}

export {
  SystemDB,
  TenantDB
}