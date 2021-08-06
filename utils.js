const { request } = require("express");
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

const generateId = () => crypto.randomBytes(8).toString('hex');

module.exports = {
    notFoundHandler,
    parseBody,
    generateId
};