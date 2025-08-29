export const EnvConfiguration = () => ({
  env: process.env.NODE_ENV || 'dev',
  port: process.env.APP_PORT || '3001',
  DB: {
    needDomain: true,
    poolName: 'projectRequest',
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    domain: process.env.DB_DOMAIN,
    userName: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});
