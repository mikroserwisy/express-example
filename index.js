const http = require('http');
const messages = require('./data/messages.json');
const users = require('./data/users.json');

const server = http.createServer((request, response) => {
    const route = `${request.method} ${request.url}`;
    console.log(route);
    response.setHeader('Content-Type', 'application/json');
    if (route === 'GET /messages') {
        response.end(JSON.stringify(messages));
    } else if (route === 'GET /users') {
        response.end(JSON.stringify(users));
    } else {
        response.statusCode = 404;
        response.end(`Route ${route} not found`);
    }
});

server.listen(3000, () => console.log('Listening on port 3000'));