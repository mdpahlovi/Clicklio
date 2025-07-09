export default () => ({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || 4000,
    apiPrefix: process.env.API_PREFIX,
    appVersion: process.env.APP_VERSION,
});
