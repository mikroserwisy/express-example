const messagesRepository = require('./messages-repository');

const getMessages = () => messagesRepository.getAll();

const getMessage = (id) => messagesRepository.getById(id);

const addMessage = (message) => messagesRepository.save(message);

const updateMessage = (message) => messagesRepository.update(message);

const deleteMessage = (id) => messagesRepository.deleteById(id);

module.exports = {
    getMessages,
    getMessage,
    updateMessage,
    deleteMessage,
    addMessage
};