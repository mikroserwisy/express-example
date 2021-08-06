const messages = require('../data/messages.json');
const { notFoundHandler, parseBody, generateId } = require('../utils');
const express = require("express");

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

const addMessage = async (request, response) => {
    const body = await parseBody(request);
    const message = { ...JSON.parse(body), id: generateId() }
    messages.push(message);
    response.status(201);
    response.setHeader('Location', `/message/${message.id}`);
    response.end();
};

const updateMessage = async (request, response) => {
    const body = await parseBody(request);
    const message = messages.find(message => message.id === request.params.id);
    if (!message) {
        notFoundHandler(request, response)
    } else {
        Object.assign(message, JSON.parse(body));
        response.send(message);
    }
};

const deleteMessage = async (request, response) => {
    const index = messages.findIndex(message => message.id === request.params.id);
    if (index === -1) {
        notFoundHandler(request, response)
    } else {
        messages.splice(index, 1);
        response.sendStatus(204);
    }
};

const getMessagesForUsers = (request, response) => {
    response.send(request.params);
};

const router = express.Router();
router.route('/')
    .get(getMessages)
    .post(addMessage);

router.route('/:id')
    .get(getMessage)
    .patch(updateMessage)
    .delete(deleteMessage);

router.get('/from/:sender/to/:recipient', getMessagesForUsers);

module.exports = router;