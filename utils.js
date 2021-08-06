const { request, response} = require("express");
const crypto = require('crypto');

const notFoundHandler = (request, response) => {
    const route = `${request.method} ${request.url}`;
    response.statusCode = 404;
    response.end(`Route ${route} not found`);
};

const parseBody = (request) => {
  return new Promise(resolve => {
      const chunks = [];
      request.on('data', (chunk) => chunks.push(chunk));
      request.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

const parseJson = async (request, response, next) => {
    const body = await parseBody(request);
    request.body = JSON.parse(body);
    next();
};

const generateId = () => crypto.randomBytes(8).toString('hex');

const logger = (request, response, next) => {
    console.log(`${request.method} ${request.url}`);
    next();
};

class NotFound extends Error {

    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }

}

const onNotFoundExceptionHandler = (error, request, response, next) => {
    if (error instanceof NotFound) {
        notFoundHandler(request, response);
    } else {
        next(error);
    }
};

module.exports = {
    notFoundHandler,
    parseBody,
    generateId,
    logger,
    NotFound,
    onNotFoundExceptionHandler,
    parseJson
};