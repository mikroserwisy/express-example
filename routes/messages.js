const messages = require('../data/messages.json');
const { notFoundHandler } = require('../utils');
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

const getMessagesForUsers = (request, response) => {
    response.send(request.params);
};

const router = express.Router();
router.get('/', getMessages);
router.get('/:id', getMessage);
router.get('/from/:sender/to/:recipient', getMessagesForUsers);

module.exports = router;