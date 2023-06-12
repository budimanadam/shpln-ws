import Promise from 'bluebird';
import pgp from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { DBConfig, SystemDB, TenantDB } from './db';

let connections = {};

export const PgPromise: pgp.IMain = pgp({
  promiseLib: Promise,
  async connect(client, dc, useCount) {
    if (useCount === 0 && dc && dc.email) {
      const email: string = encodeURI(dc.email);
      await client.query(`SET SESSION "app.user" = '${email}'`);
    }
  },
});
export const PgSysDb: pgp.IDatabase<{}, IClient> = getConnection(SystemDB);
export const PgTenantDb: pgp.IDatabase<{}, IClient> = getConnection(TenantDB);
export const tenantDb = (host: string): pgp.IDatabase<{}, IClient> => getConnection(TenantDB, host);

function getConnection(dbConfig: DBConfig, host?: string): pgp.IDatabase<{}, IClient> {
  const key = `CONN:${dbConfig}:${host}`;
  let connection: pgp.IDatabase<{}, IClient> = connections[key];

  if (!connection) {
    const conn = { ...dbConfig.connection };
    if (host) conn.host = host;
    connection = PgPromise(conn);
    connections[key] = connection;
  }

  return connection;
}

export function QueryBuilder(table: string, column?: string, schema?: string): string {
  const schemaName: string = schema || 'public';
  const condition: string = column ? `WHERE ${column} = $1` : '';
  const sql: string = `SELECT * FROM ${schemaName}.${table} ${condition}`;
  return sql;
}

export const Helpers = PgPromise.helpers;
