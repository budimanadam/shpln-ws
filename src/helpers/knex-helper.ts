import knex, { Knex } from 'knex'
import { DBConfig } from '../db/db'
import config from '../config'

interface IPool {
    max: number
    min: number
}

export interface ITenantConfig extends DBConfig {
    poolSize?: number
    pool?: IPool
    schemaName?: string
    tenantId?: string
    companyId?: string
}

export const KnexSystem = (): Knex => {
    const opts = {
        client: 'pg',
        connection: {
            user: config.SYSTEM_DB_USER,
            password: config.SYSTEM_DB_PASSWORD,
            host: config.SYSTEM_DB_HOST,
            port: Number(config.SYSTEM_DB_PORT),
            database: config.SYSTEM_DB,
            poolsize: 10,
            max: 10,
            idleTimeoutMillis: 30000,
        }
    }

    return knex(opts)
}

export const KnexTenant = (schemaName: string, host?: string, opts?: ITenantConfig): Knex => {
    if (!opts) {
        opts = {
            client: 'pg',
            connection: {
                user: config.TENANT_DB_USER,
                database: config.TENANT_DB,
                port: parseInt(config.TENANT_DB_PORT, 10),
                host: host,
                password: config.TENANT_DB_PASSWORD,
                poolsize: parseInt(config.TENANT_POOL_SIZE, 10),
                max: parseInt(config.TENANT_POOL_SIZE, 10),
                idleTimeoutMillis: parseInt(config.POOL_IDLE_TIMEOUT, 10)
            },
            pool: {
                max: 1,
                min: 1
            },
            schemaName
        }
    }
    return knex(opts)
}