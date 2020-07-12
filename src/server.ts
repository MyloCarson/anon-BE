import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import CompanyRoute from './routes/company';
import RouteNotFound from './routes/notFound';
import httpCodes from 'http-status-codes'

import './utils/database';
import logger from './utils/winston';
import SectorRoute from './routes/sector';
import SecretQuestionRoute from './routes/secretQuestion'
import UserRoute from './routes/user'
import ReviewRoute from './routes/review'
import CommentRoute from './routes/comment';
import {SocketConnection} from './services/socket'
import { Server } from 'http';
import { transport } from './utils/mailer';

// initialize configuration
dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || process.env.SERVER_PORT;
const BASE_URL = '/api/v1';


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.get('/', (_req, res) => {
    res.status(httpCodes.OK).json({ "status": `up`});
});
app.use(`${BASE_URL}/companies`, CompanyRoute)
app.use(`${BASE_URL}/sectors`, SectorRoute)
app.use(`${BASE_URL}/questions`, SecretQuestionRoute);
app.use(`${BASE_URL}/users`, UserRoute);
app.use(`${BASE_URL}/reviews`, ReviewRoute);
app.use(`${BASE_URL}/comments`, CommentRoute)

app.use(RouteNotFound);

// // start the Express server
const server:Server = app.listen( port, () => {
    logger.debug( `server started at http://localhost:${ port }` );
} );

// initialize socket
export const Socket  = SocketConnection.getInstance().initialize(server);

transport.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });