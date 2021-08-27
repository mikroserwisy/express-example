const development = {
    tokenSignature: 'symmetrickey',
    https: true
};

const production = {
    tokenSignature: 'sadfkiu23r34bnrjkbqfqwekjk'
};

const env = process.env.NODE_ENV !== 'production' ? development : Object.assign({}, development, production);

module.exports = env;