import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './winston';
dotenv.config();
const MONGODB_URI: string = process.env.MONGODB_URI!;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false})
    .then(() => {
        logger.debug('MongoDB is connected');
    })
    .catch((err) => {
        logger.error(err);
        logger.debug('MongoDB connection unsuccessful.');
    });