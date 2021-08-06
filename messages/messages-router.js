const express = require("express");
const { parseJson } = require("../utils");
const messagesService = require("./messages-service");
const messagesRepository = require("./messages-repository");
const router = express.Router();

const getMessages = (request, response) => {
    const messages = messagesService.getMessages();
    response.send(messages);
};

const getMessage = (request, response) => {
    const message = messagesService.getMessage(request.params.id);
    response.send(message);
};

const addMessage = (request, response) => {
    const message = messagesService.addMessage(request.body);
    response.status(201);
    response.setHeader('Location', `/message/${message.id}`);
    response.end();
};

const updateMessage = (request, response) => {
    request.body.id = request.params.id;
    const message = messagesService.updateMessage(request.body);
    response.send(message);
};

const deleteMessage = (request, response) => {
    messagesService.deleteMessage(request.params.id);
    response.sendStatus(204);
};

const getMessagesForUsers = (request, response) => {
    response.send(request.params);
};

router.route('/')
    .get(getMessages)
    .post(parseJson, addMessage);

router.route('/:id')
    .get(getMessage)
    .patch(parseJson, updateMessage)
    .delete(deleteMessage);

router.get('/from/:sender/to/:recipient', getMessagesForUsers);

module.exports = router;