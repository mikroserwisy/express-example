import winston from 'winston';
import expressWinston from 'express-winston';
import env from '../../env';

const mainFile = `${env.logsDirectory}/main.log`;
const errorsFile = `${env.logsDirectory}/errors.log`;
const requestsFile = `${env.logsDirectory}/requests.log`;
const maxLogFileSizeInBytes = 10000000;
const maxNumberOfLogFiles = 5;

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: mainFile,
            maxsize: maxLogFileSizeInBytes,
            maxFiles: maxNumberOfLogFiles
        }),
        new winston.transports.File({
            filename: errorsFile,
            level: 'error',
            maxsize: maxLogFileSizeInBytes,
            maxFiles: maxNumberOfLogFiles
        })
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const loggingMiddleware = expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: requestsFile,
            maxsize: maxLogFileSizeInBytes,
            maxFiles: maxNumberOfLogFiles
        }),
        new winston.transports.Console()
    ],
    meta: false,
    expressFormat: true
});

export {logger, loggingMiddleware};