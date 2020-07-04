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

export const addToken = (userObj: Partial<IUser>): Partial<IUser> => {
    const _userObj = userObj;
    let token = uuidv4();
    token = token.substr(0, token.indexOf('-'));
    _userObj.token = token.toUpperCase();

    return _userObj;
}

export const validateCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validate(req.body, {
        name: {
            type: 'string',
        },
        secret_question: {
            presence: true,
            type: 'string',
            length: {
                minimum: 20
            }
        },
        secret_answer: {
            presence: true,
            type: 'string',
        },
    })
    if(errors){
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }


    let userObj = req.body as Partial<IUser>;
    if(!userObj.name || _.isEmpty(userObj.name) || _.isNull(userObj.name) || userObj.name?.length < 2){
        userObj.name = randomFullName();
        userObj = addToken(userObj);
    }
    allServices.userService.getUser(userObj)
    .then( result => {
        if(result) { // if user exists, generate new name and proceed
            const userObj = req.body as Partial<IUser>;
            userObj.name = randomFullName();
            req.body = addToken(userObj);
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
        token: {
            presence: true,
            type: 'string',
        },
        secret_question: {
            presence: true,
            type: 'string',
            length: {
                minimum: 20
            }
        },
        secret_answer: {
            presence: true,
            type: 'string',
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