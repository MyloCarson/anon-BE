
import dotenv from 'dotenv';
import http from 'http';
import app from './src/server';
import logger from './src/utils/winston';

dotenv.config();


const port = process.env.SERVER_PORT;
app.set('port', port);

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: any) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.debug(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.debug(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = async() => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr!.port}`;
    logger.info(`Listening on ${bind}`);
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//server.timeout = 240000;

export default server;