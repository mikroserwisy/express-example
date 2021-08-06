const users = require('../data/users.json');

const getByUsername = (username) => users.find(user => user.username === username);

module.exports = {
    getByUsername
};