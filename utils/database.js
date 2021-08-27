const env = require('../env');
const { logger } = require("../utils/logging");
const {MongoClient} = require("mongodb");

const mongodbConnectionUri = `mongodb://${env.mongodbUser}:${env.mongodbPassword}@${env.mongodbHost}:${env.mongodbPort}/${env.mongodbDatabase}?retryWrites=true&writeConcern=majority`;
const client = new MongoClient(mongodbConnectionUri);

let db;

async function connectToMongoDB() {
    await client.connect();
    logger.info('Connected to MongoDB');
    db = client.db(env.mongodbDatabase);
}

module.exports = { connectToMongoDB, getDb: () => db };