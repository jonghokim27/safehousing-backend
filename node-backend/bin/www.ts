/**
 * Module dependencies
 */

import Debug from 'debug';
import http from 'http';
import { AddressInfo } from 'net';
import { HttpError } from 'http-errors';
import * as configs from '../src/configs/index';
import app from '../src/app';

const debug: Debug.Debugger = Debug('safehousing-backend:server');

/**
 * Get port from environment and store in Express
 */

const port: number = 80;
app.set('port', port);

/**
 * Create HTTP server
 */

const server: http.Server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces
 */

server.listen(port, () => {
    console.log(`✅ Listening on PORT: ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event
 */

function onError(error: HttpError): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind: string = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event
 */

function onListening(): void {
    const addr: string | AddressInfo | null = server.address();
    const bind: string = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr?.port}`;
    debug(`Listening on ${bind}`);
}