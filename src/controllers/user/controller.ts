import dotenv from 'dotenv'
import { Request, Response } from "express";
import {allServices} from '../../services';
import * as _ from 'lodash';
import Boom from  'boom';
import {messages} from '../../constants/messages'
import ResponseTransformer, { SuccessResponse } from '../../helpers/response';
import logger from '../../utils/winston';
import httpCodes from 'http-status-codes';
import { IUser } from '../../services/user/user.schema';
import * as bycrpt from 'bcrypt'
import { sendEmail } from '../../utils/mailer';
import { PasswordResetTemplate } from "../../utils/emailTemplates/resetPassword";

dotenv.config()
const responseTransformer = new ResponseTransformer();

export const create = (req: Request, res: Response): unknown => {
    const _user = req.body as IUser;

    if(_.isEmpty(_user)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }
    
    allServices.userService.create(_user)
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.CREATED,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch(error => {
        logger.error('User Creation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const login = (req: Request, res: Response): unknown => {
    const _user = req.body as IUser;

    if(_.isEmpty(_user)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }

    allServices.userService.getUser(_user)
    .then(result => {
        if(result){
            const same  = bycrpt.compareSync(_user.password, result?.password);
            if(!same) {
                const {output} = Boom.badRequest('email or password incorrect',{})
                return responseTransformer.handleError(res, output)
            }

            delete result.password
            delete result.email
            
            const responseObj: SuccessResponse = {
                data: result,
                statusCode: httpCodes.OK,
                status: messages.SUCCESS,
            }
            return responseTransformer.handleSuccess(res, responseObj);
        }

        logger.error('Login User not found error: %o', result);
        const {output} = Boom.badRequest('email or password incorrect')
        return responseTransformer.handleError(res, output)
    })
    .catch(error => {
        logger.error('User GET error: %o', error);
        const {output} = Boom.badRequest('email or password incorrect');
        return responseTransformer.handleError(res, output)
    })
}

export const getAllUsers = (req: Request, res: Response) => {
    allServices.userService.getAll()
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch(error => {
        logger.error('User GET ALL error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    });
}

export const forgotPassword = (req: Request, res: Response) => {
    const userObj: IUser = req.body as IUser
    allServices.userService.forgotPassword(userObj)
    .then( result => {
        const responseObj: SuccessResponse = {
            data: {message: messages.RESET_LINK_SENT},
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        if(result){
            const link = process.env.FORGOT_BASE_LINK as string + result.resetToken
            sendEmail('Password your Anon password.', result.email, PasswordResetTemplate(link))
        }
        return responseTransformer.handleSuccess(res, responseObj);
        
    })
    .catch(error => {
        logger.error('User GET ALL error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    });
}

export const resetPassword = (req: Request, res: Response) => {
    const userObj: IUser = req.body as IUser
    allServices.userService.resetPassword(userObj)
    .then( result => {
        if(!result){
            const {output} = Boom.badRequest('Token has expired');
            return responseTransformer.handleError(res, output)
        }

        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj)
        
    })
    .catch(error => {
        logger.error('User GET ALL error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    });
}

