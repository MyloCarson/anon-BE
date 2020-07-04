import express from 'express';
import * as UserController from '../controllers/user/controller';
import { validateCreateUser, validateFetchUser } from '../validations/user/validate';

const UserRoute = express.Router();

UserRoute.post('/', validateCreateUser, UserController.create);
UserRoute.post('/user', validateFetchUser, UserController.getUser)
UserRoute.get('/all', UserController.getAllUsers)


export default UserRoute;