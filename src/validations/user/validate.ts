import {allServices} from '../../services';
import {Request, Response, NextFunction} from 'express';
import ResponseTransformer from '../../helpers/response';
import Boom from 'boom';
import logger from '../../utils/winston';
import { IUser } from '../../services/user/user.schema';
import validate from "validate.js";
import { randomFullName } from '../../constants/randomNames';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const responseTransformer = new ResponseTransformer();

// export const addToken = (userObj: Partial<IUser>): Partial<IUser> => {
//     const _userObj = userObj;
//     let token = uuidv4();
//     token = token.substr(0, token.indexOf('-'));
//     _userObj.token = token.toUpperCase();

//     return _userObj;
// }

export const validateCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validate(req.body, {
        email: {
            presence: true,
            email: true,
            type: 'string'
        },
        password: {
            presence: true,
            type: 'string',
            length: {
                minimum: 4
            }
        },
    })
    if(errors){
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }


    const userObj = req.body as Partial<IUser>;
    if(!userObj.name || _.isEmpty(userObj.name) || _.isNull(userObj.name) || userObj.name?.length < 2){
        userObj.name = randomFullName()
        userObj.public_id = uuidv4()
        req.body = userObj
    }
    allServices.userService.getUser(userObj)
    .then( result => {
        if(result) { // if user exists, generate new name and proceed
            const userObj = req.body as Partial<IUser>
            userObj.name = randomFullName()
            userObj.public_id = uuidv4()
            req.body = userObj
            return next()
        }

        return next();
        
    })
    .catch( error => {
        logger.error('User Create Validation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const validateFetchUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validate(req.body, {
        email: {
            presence: true,
            type: 'string',
            email: true
        },
        password: {
            presence: true,
            type: 'string',
            length: {
                minimum: 4
            }
        },
    })
    if(errors){
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }

    return next();
}

export const validateForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validate(req.body, {
        email: {
            presence: true,
            type: 'string',
            email: true
        }
    })
    if(errors){
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }

    return next();
}

export const validateReset = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validate(req.body, {
        resetToken: {
            presence: true,
            type: 'string',
        },
        password: {
            presence: true,
            type: 'string',
            length: {
                minimum: 4
            }
        },
    })
    if(errors){
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }

    return next();
}