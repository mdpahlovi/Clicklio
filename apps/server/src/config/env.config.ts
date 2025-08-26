export const config = () => ({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || 4000,
    apiPrefix: process.env.API_PREFIX,
    appVersion: process.env.APP_VERSION,
    origin: process.env.ORIGIN,
    serverIp: process.env.SERVER_IP,

    // Postgres
    postgres: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
    },

    // Redis
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET,
    },
});
