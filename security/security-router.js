const usersRepository = require('../users/users-repository');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const { tokenSignature } = require('../config');
const { parseJson, NotFound} = require("../utils");

const basicAuth = async (request, response, next) => {
  const authorizationHeader = request.headers.authorization || '';
  const [type, value] = authorizationHeader.split(' ');
  if (type === 'Basic') {
    const credentials = Buffer.from(value, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const user = usersRepository.getByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      request.principal = user;
      next();
    } else {
      response.sendStatus(401);
    }
  } else {
    next();
  }
};

const tokenAuth = (request, response, next) => {
  const authorizationHeader = request.headers.authorization || '';
  const [type, token] = authorizationHeader.split(' ');
  if (type === 'Bearer') {
    try {
      const payload = jwt.verify(token, tokenSignature);
      const user = usersRepository.getByUsername(payload.username);
      if (user) {
        request.principal = user;
        next();
        return;
      }
    } catch (error) {
      response.sendStatus(401);
      return;
    }
    throw new NotFound();
  } else {
    next();
  }
};

const requireAuth = (request, response, next) => {
  if (request.principal) {
    next();
  } else {
    response.sendStatus(401);
  }
};

const createToken = async (request, response) => {
  const credentials = request.body;
  const user = usersRepository.getByUsername(credentials.username);
  if (user && await bcrypt.compare(credentials.password, user.password)) {
    const token = jwt.sign({ 'username' : credentials.username, id: user.id, role: 'user' }, tokenSignature, { expiresIn: '1d' });
    response.send(token);
    response.end();
  } else {
    response.sendStatus(401);
  }
}

const router = express.Router();
router.post('/', parseJson, createToken);

module.exports = {
  basicAuth,
  tokenAuth,
  requireAuth,
  createToken,
  securityRouter: router
};