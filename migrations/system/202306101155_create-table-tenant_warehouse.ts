import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.raw(`
    CREATE TABLE public.warehouse (
        channel_id serial NOT NULL,
        channel_name citext NULL,
        CONSTRAINT pk_warehouse PRIMARY KEY (channel_id)
      );
    
      CREATE TABLE public.tenant_warehouse (
        tenant_id citext NOT NULL,
        channel_id int4 NOT NULL,
        channel_user_id citext NULL,
        channel_user_secret citext NULL,
        company_id int4 NOT NULL,
        extra_info jsonb NULL,
        last_refresh timestamptz NULL,
        warehouse_id serial NOT NULL,
        is_active bool NULL DEFAULT true,
        CONSTRAINT pk_tenant_warehouse PRIMARY KEY (tenant_id,channel_id,company_id)
      );
    
      ALTER TABLE public.tenant_warehouse ADD CONSTRAINT warehouse_tenant_warehouse FOREIGN KEY (channel_id) REFERENCES public.warehouse(channel_id) ON DELETE CASCADE ON UPDATE CASCADE;`)
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('city')
}

