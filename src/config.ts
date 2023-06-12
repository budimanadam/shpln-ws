export default <any>{
    PORT: process.env.PORT || 3000,
    ES_LOG_ID: process.env.ES_LOG_ID,
    ES_API_KEY: process.env.ES_API_KEY,
    ES_LOG_NODE: process.env.ES_LOG_NODE || 'https://es.jubelio.com',
    SYSTEM_DB_HOST: process.env.SYSTEM_DB_HOST,
    SYSTEM_DB: process.env.SYSTEM_DB,
    SYSTEM_DB_PORT: parseInt(process.env.SYSTEM_DB_PORT, 10),
    SYSTEM_DB_USER: process.env.SYSTEM_DB_USER,
    SYSTEM_DB_PASSWORD: process.env.SYSTEM_DB_PASSWORD,
    TENANT_DB_HOST: process.env.TENANT_DB_HOST,
    TENANT_DB: process.env.TENANT_DB,
    TENANT_DB_PORT: parseInt(process.env.TENANT_DB_PORT, 10),
    TENANT_DB_USER: process.env.TENANT_DB_USER,
    TENANT_DB_PASSWORD: process.env.TENANT_DB_PASSWORD,
  };
  