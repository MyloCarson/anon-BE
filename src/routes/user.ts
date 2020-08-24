import express from 'express';
import * as UserController from '../controllers/user/controller';
import { validateCreateUser, validateFetchUser, validateForgotPassword, validateReset } from '../validations/user/validate';
import emailVerification from '../middleware/emailVerification';
const UserRoute = express.Router();

UserRoute.post('/create', validateCreateUser, UserController.create);
UserRoute.post('/login', validateFetchUser, UserController.login)
UserRoute.get('/all', UserController.getAllUsers)
UserRoute.post('/reset', validateReset, UserController.resetPassword)
UserRoute.post('/forgot', validateForgotPassword, UserController.forgotPassword)
UserRoute.get('/validate/:token', emailVerification, UserController.verifyEmail);

export default UserRoute;