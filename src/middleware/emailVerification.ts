import dotenv from 'dotenv';
import { Request, Response, NextFunction} from "express"
import ResponseTransformer, { SuccessResponse } from '../helpers/response';
import Boom from  'boom';
import {messages} from '../constants/messages'
import jwt from 'jsonwebtoken'
import { allServices } from '../services';
import { IUserRequest } from '../services/user/user.schema'
import httpCodes from 'http-status-codes';


export interface RequestWithUser extends Request {
    user?: IUserRequest;
}

const responseTransformer = new ResponseTransformer();


export default async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const {token}  = req.params;
    if(token){

        try{
            const data = jwt.verify(token, process.env.EMAIL_VALIDATION_SECRET_KEY as string) as IUserRequest

            const _user = await allServices.userService.getUserByPublicKey({public_id: data.public_id})
            if(_user){
                req.user = _user;
                return next();
            } else {
                const { output } = Boom.unauthorized('Access token is invalid');
                return responseTransformer.handleError(res, output);
            }
            
        } catch(error) {
            if(error.name === 'TokenExpiredError') {
                const { output } = Boom.unauthorized('Access token is invalid');
                return responseTransformer.handleError(res, output);
            }
            
            const { output } = Boom.badRequest(messages.INVALID_DATA);
            return responseTransformer.handleError(res, output);
        }

    } else {
        const { output } = Boom.badRequest(messages.TOKEN_NOT_FOUND);
        return responseTransformer.handleError(res, output);
    }
}