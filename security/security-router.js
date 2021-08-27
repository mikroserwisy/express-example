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
      response.locals.principal = user;
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
        response.locals.principal = user;
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
  if (response.locals.principal) {
    next();
  } else {
    response.sendStatus(401);
  }
};

const authenticate = async (request, response) => {
  const credentials = request.body;
  if (credentials.refreshToken) {
      try {
          const payload = jwt.verify(credentials.refreshToken, tokenSignature);
          const user = usersRepository.getByUsername(payload.username);
          if (user) {
              response.send(generateTokens(user.name));
              response.end();
          } else {
              response.sendStatus(401);
          }
      } catch (error) {
          response.sendStatus(401);
          return;
      }
  } else {
      const user = usersRepository.getByUsername(credentials.username);
      if (user && await bcrypt.compare(credentials.password, user.password)) {
          response.send(generateTokens(user.name));
          response.end();
      } else {
          response.sendStatus(401);
      }
  }
}

const generateTokens = (username) => {
    const options = { expiresIn: '1m' };
    const token = jwt.sign({ 'username' : username, roles: ['user'] }, tokenSignature, options);
    const refreshToken = jwt.sign({ 'username' : username }, tokenSignature, options);
    return { token, refreshToken, expiresIn: options.expiresIn };
};

const router = express.Router();
router.post('/', parseJson, authenticate);

module.exports = {
  basicAuth,
  tokenAuth,
  requireAuth,
  createToken: authenticate,
  securityRouter: router
};