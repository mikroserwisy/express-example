const express = require('express');
const messages = require('./data/messages.json');
const users = require('./data/users.json');

const getMessages = (request, response) => {
    response.send(messages);
};

const getMessage = (request, response) => {
   const message = messages.find(message => message.id === request.params.id);
   if (!message) {
       notFoundHandler(request, response)
   } else {
       response.send(message);
   }
};

const getUsers = (request, response) => {
    response.send(users);
};

const getUser = (request, response) => {
    const user = users.find(user => user.id === request.params.id);
    if (!user) {
        notFoundHandler(request, response)
    } else {
        response.send(user);
    }
};

const getMessagesForUsers = (request, response) => {
    response.send(request.params);
};

const notFoundHandler = (request, response) => {
    const route = `${request.method} ${request.url}`;
    response.statusCode = 404;
    response.end(`Route ${route} not found`);
};

const router = express.Router();
router.get('/messages', getMessages);
router.get('/messages/:id', getMessage);
router.get('/messages/from/:sender/to/:recipient', getMessagesForUsers);
router.get('/users', getUsers);
router.get('/users/:id', getUser);

const app = express();
app.use(router);

app.listen(3000, () => console.log('Listening on port 3000'));
