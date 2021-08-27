const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const notFoundHandler = (request, response) => {
    const route = `${request.method} ${request.url}`;
    response.statusCode = 404;
    response.end(`Route ${route} not found`);
};

const parseJson = bodyParser.json({limit: '150kb'});

const generateId = () => crypto.randomBytes(8).toString('hex');

const logger = morgan('tiny');

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
    generateId,
    logger,
    NotFound,
    onNotFoundExceptionHandler,
    parseJson
};