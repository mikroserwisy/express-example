const express = require('express');
const compression = require('compression');
const serveStatic = require('serve-static');
//const bcrypt = require('bcrypt');
const path = require("path");
const messagesRouter = require('./messages/messages-router');
const usersRouter = require('./users/users-router');
const security = require('./security/security-router')
const { logger, onNotFoundExceptionHandler } = require("./utils");

const app = express();
app.use(compression({level: 9, filter: () => true }));
app.use(logger);
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/security', security.securityRouter);
app.use(security.basicAuth)
app.use(security.tokenAuth)
app.use('/upload', serveStatic(path.join(__dirname, 'upload')));
app.use('/messages', messagesRouter);
app.use('/users', usersRouter);
app.use(onNotFoundExceptionHandler);

//console.log(Buffer.from('bucky:sierra').toString('base64'));

//const saltRounds = 10;
//const hashedPassword = bcrypt.hash('sierra', saltRounds).then((password) => console.log(password));

app.listen(3000, () => console.log('Listening on port 3000'));

