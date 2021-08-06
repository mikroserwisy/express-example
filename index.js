//const http = require('http');
const express = require('express');
const messages = require('./data/messages.json');
const users = require('./data/users.json');

const app = express();
app.use((request, response) => {
    const route = `${request.method} ${request.url}`;
    console.log(route);
    if (route === 'GET /messages') {
        response.send(messages);
    } else if (route === 'GET /users') {
        response.send(users);
    } else {
        response.statusCode = 404;
        response.end(`Route ${route} not found`);
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));

//const server = http.createServer(app);
//server.listen(3000, () => console.log('Listening on port 3000'));