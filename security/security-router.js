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
      if (payload.roles === undefined) {
          response.sendStatus(401);
          return;
      }
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
    response.sendStatus(401);
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
  const onSuccess = () => {
      response.send(generateTokens(user.username, user.roles));
      response.end();
  };
  let user, validator;
  if (credentials.refreshToken) {
      validator = () => {
          const payload = jwt.verify(credentials.refreshToken, tokenSignature);
          user = usersRepository.getByUsername(payload.username);
          return user !== undefined;
      }
  } else {
      user = usersRepository.getByUsername(credentials.username);
      validator = async () => user && await bcrypt.compare(credentials.password, user.password)
  }
  await verify(response, validator, onSuccess);
}

const verify = async (response, validator, onSuccess) => {
    try {
        if (await validator()) {
            return onSuccess();
        } else  {
            response.sendStatus(401);
        }
    } catch (error) {
        response.sendStatus(401);
    }
};

const authorize = (policy) => (request, response, next) => {
    if (policy(response.locals.principal)) {
        next();
    } else {
        response.sendStatus(403);
    }
}

const rolePolicy = (roleName) => (principal) => principal.roles.indexOf(roleName) !== -1;

const generateTokens = (username, roles) => {
    const options = { expiresIn: '3600s' };
    const refreshToken = jwt.sign({ username }, tokenSignature, options);
    const token = jwt.sign({ username, roles }, tokenSignature, options);
    return { token, refreshToken };
};

const router = express.Router();
router.post('/', parseJson, authenticate);

module.exports = {
  basicAuth,
  tokenAuth,
  requireAuth,
  createToken: authenticate,
  securityRouter: router,
  authorize,
  rolePolicy
};