const express = require('express');
const messagesRouter = require('./routes/messages');
const usersRouter = require('./routes/users');
const { logger, onNotFoundExceptionHandler } = require("./utils");

const app = express();
app.use(logger);
app.use('/messages', messagesRouter);
app.use('/users', usersRouter);
app.use(onNotFoundExceptionHandler);

app.listen(3000, () => console.log('Listening on port 3000'));
