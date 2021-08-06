const express = require("express");
const { parseJson } = require("../utils");
const multer = require('multer');
const path = require("path");
const messagesService = require("./messages-service");
const security = require("../security/security-router");
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
    const attachments = (request.files || []).map(file => `/uploads/${file.filename}`);
    const message = { ...messagesService.addMessage(request.body), attachments };
    response.status(201);
    response.setHeader('Location', `/message/${message.id}`);
    response.send(message);
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

const Storage = multer.diskStorage({
    destination(request, file, callback) {
        callback(null, './upload');
    },
    filename(request, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
});

//const uploadAttachment = multer({ dest: path.join(__dirname, '../upload') });
const uploadAttachment = multer({ storage: Storage });

router.use(security.requireAuth);
router.route('/')
    .get(getMessages)
    .post(parseJson, uploadAttachment.array('attachments', 3), addMessage);

router.route('/:id')
    .get(getMessage)
    .patch(parseJson, updateMessage)
    .delete(deleteMessage);

router.get('/from/:sender/to/:recipient', getMessagesForUsers);

module.exports = router;