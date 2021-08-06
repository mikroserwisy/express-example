const messages = require('../data/messages.json');
const { notFoundHandler, generateId, NotFound, parseJson} = require('../utils');
const express = require("express");

const getMessages = (request, response) => {
    response.send(messages);
};

const getMessage = (request, response) => {
    const message = messages.find(message => message.id === request.params.id);
    if (!message) {
        throw new NotFound();
    } else {
        response.send(message);
    }
};

const addMessage = (request, response) => {
    const message = { ...request.body, id: generateId() }
    messages.push(message);
    response.status(201);
    response.setHeader('Location', `/message/${message.id}`);
    response.end();
};

const updateMessage = (request, response) => {
    const message = messages.find(message => message.id === request.params.id);
    if (!message) {
        notFoundHandler(request, response)
    } else {
        Object.assign(message, request.body);
        response.send(message);
    }
};

const deleteMessage = async (request, response) => {
    const index = messages.findIndex(message => message.id === request.params.id);
    if (index === -1) {
        throw new NotFound();
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
    .post(parseJson, addMessage);

router.route('/:id')
    .get(getMessage)
    .patch(parseJson, updateMessage)
    .delete(deleteMessage);

router.get('/from/:sender/to/:recipient', getMessagesForUsers);

module.exports = router;