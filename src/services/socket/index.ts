import socketIo from 'socket.io'
import logger from '../../utils/winston'
import { Server } from 'http';

export class SocketConnection {
    private static _instance:SocketConnection = new SocketConnection();
    
    constructor() {
        if(SocketConnection._instance){
            throw new Error("Error: Instantiation failed: Use SocketConnection.getInstance() instead of new.");
        }
        SocketConnection._instance = this;
    }
    public initialize(server: Server): socketIo.Server{
        logger.debug(':::::::::::::::::: Socket Initialized ::::::::::::');
        const socketServer = socketIo(server)
        socketServer.on('connection', (socket: any) => {
            logger.debug('Client connected' , socket.client.id);
            
            socket.on('disconnect', () => {
                logger.debug('Client disconnected', 'Socket Server' );
            });
          });
          return socketServer
    }

    public static getInstance(): SocketConnection {
        return this._instance;
    }
}