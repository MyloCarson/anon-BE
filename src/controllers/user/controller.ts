import { Request, Response } from "express";
import {allServices} from '../../services';
import * as _ from 'lodash';
import Boom from  'boom';
import {messages} from '../../constants/messages'
import ResponseTransformer, { SuccessResponse } from '../../helpers/response';
import logger from '../../utils/winston';
import httpCodes from 'http-status-codes';
import { IUser } from '../../services/user/user.schema';

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

export const getUser = (req: Request, res: Response): unknown => {
    const _user = req.body as IUser;

    if(_.isEmpty(_user)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }

    allServices.userService.getUser(_user)
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch(error => {
        logger.error('User GET error: %o', error);
        const {output} = Boom.badRequest(error);
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

