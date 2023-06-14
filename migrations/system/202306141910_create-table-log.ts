import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.raw(`
    -- Drop table

    -- DROP TABLE log;

    CREATE TABLE log (
        log_id serial NOT NULL,
        log_date timestamptz NOT NULL,
        "action" citext DEFAULT NULL,
        is_success bool NULL DEFAULT false,
        url citext DEFAULT NULL,
        request_sign citext DEFAULT NULL,
        request citext NULL,
        response citext DEFAULT NULL,
        record_id int4 DEFAULT NULL,
        record_name citext DEFAULT NULL,
        record_status citext DEFAULT NULL,
        CONSTRAINT pk_log_webhook PRIMARY KEY (log_id)
    );
    CREATE INDEX log_webhook_log_date_idx ON log USING btree (log_date);

      `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('city')
}

