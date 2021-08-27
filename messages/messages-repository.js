const messages = require("../data/messages.json");
const { NotFound, generateId} = require("../utils/security");
const { db } = require('../utils/database');

const getAll = () => messages;

const getById = (id) => {
    const message = messages.find(message => message.id === id);
    if (!message) {
        throw new NotFound();
    } else {
        return message;
    }
};

const save = (message) => {
    const savedMessage = { ...message, id: generateId() };
    messages.push(savedMessage);
    return savedMessage;
}

const update = (updatedMessage) => {
    const message = messages.find(message => message.id === updatedMessage.id);
    if (!message) {
        throw new NotFound();
    } else {
        Object.assign(message, updatedMessage);
        return message;
    }
};

const deleteById = (id) => {
    const index = messages.findIndex(message => message.id === id);
    if (index === -1) {
        throw new NotFound();
    } else {
        messages.splice(index, 1);
    }
};

module.exports = {
    getAll,
    getById,
    save,
    update,
    deleteById
};