const express = require('express');
const compression = require('compression');
const serveStatic = require('serve-static');
//const bcrypt = require('bcrypt');
const path = require("path");
const messagesRouter = require('./messages/messages-router');
const usersRouter = require('./users/users-router');
const security = require('./utils/security')
const { logger, onNotFoundExceptionHandler } = require("./utils/utils");
const {authorize, rolePolicy} = require("./utils/security");
const helmet = require('helmet');
const env = require('./env');

const app = express();
app.use(helmet.contentSecurityPolicy({
    useDefaults: true, directives: {
        "frame-src": ["https://player.vimeo.com/"],
        "img-src": "'self' data: https://i.vimeocdn.com/"
    }
}));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(compression({level: 9, filter: () => true }));
app.use(logger);
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/security', security.securityRouter);
app.use(security.basicAuth)
app.use(security.tokenAuth)
app.use('/upload', serveStatic(path.join(__dirname, 'upload')));
app.use('/messages', authorize(rolePolicy('user')), messagesRouter);
app.use('/users', usersRouter);
app.use(onNotFoundExceptionHandler);

//console.log(Buffer.from('bucky:sierra').toString('base64'));

//const saltRounds = 10;
//const hashedPassword = bcrypt.hash('sierra', saltRounds).then((password) => console.log(password));

app.listen(env.port, () => console.log('Listening on port 3000'));

