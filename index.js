const express = require('express');
const messages = require('./data/messages.json');
const users = require('./data/users.json');

const getMessages = (request, response) => {
    response.send(messages);
};

const getUsers = (request, response) => {
    response.send(users);
};

const defaultHandler = (request, response) => {
    const route = `${request.method} ${request.url}`;
    response.statusCode = 404;
    response.end(`Route ${route} not found`);
};

const routes = {
    'GET /messages': getMessages,
    'GET /users': getUsers
}

const app = express();
app.use((request, response) => {
    const route = `${request.method} ${request.url}`;
    const handler = routes[route] || defaultHandler;
    console.log(route);
    handler(request, response);
});

app.listen(3000, () => console.log('Listening on port 3000'));
