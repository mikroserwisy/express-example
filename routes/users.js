const users = require('../data/users.json');
const { notFoundHandler } = require('../utils');
const express = require("express");

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

const router = express.Router();
router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;