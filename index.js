const express = require('express');
const messagesRouter = require('./routes/messages');
const usersRouter = require('./routes/users');

const app = express();
app.use('/messages', messagesRouter);
app.use('/users', usersRouter);

app.listen(3000, () => console.log('Listening on port 3000'));
