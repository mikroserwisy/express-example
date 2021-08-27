const development = {
    tokenSignature: 'symmetrickey',
    port: 3000,
};

const production = {
    tokenSignature: process.env.TOKEN_SIGNATURE,
    port: 8080
};

const env = process.env.NODE_ENV !== 'production' ? development : Object.assign({}, development, production);

module.exports = env;