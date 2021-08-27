const development = {
    tokenSignature: 'symmetrickey',
    logsDirectory: `./logs`,
    port: 3000,
    mongodbHost: 'localhost',
    mongodbPort: 27017,
    mongodbDatabase: 'app',
    mongodbUser: encodeURIComponent('admin'),
    mongodbPassword: encodeURIComponent('admin')
};

const production = {
    tokenSignature: process.env.TOKEN_SIGNATURE,
    port: 8080,
    mongodbHost: 'mongo',
    mongodbUser: encodeURIComponent(process.env.MONGODB_USER),
    mongodbPassword: encodeURIComponent(process.env.MONGODB_PASSORD)
};

const env = process.env.NODE_ENV !== 'production' ? development : Object.assign({}, development, production);

module.exports = env;