const express = require('express');
const compression = require('compression');
const serveStatic = require("serve-static");
const path = require("path");
const messagesRouter = require('./messages/messages-router');
const usersRouter = require('./users/users-router');
const { logger, onNotFoundExceptionHandler } = require("./utils");
const {request} = require("express");


const app = express();
app.use(compression({level: 9, filter: () => true }));
app.use(logger);
app.use('/upload', serveStatic(path.join(__dirname, 'upload')));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/messages', messagesRouter);
app.use('/users', usersRouter);
app.use(onNotFoundExceptionHandler);

app.listen(3000, () => console.log('Listening on port 3000'));
