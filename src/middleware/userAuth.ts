import dotenv from 'dotenv';
import { Request, Response, NextFunction} from "express"
import { IUserRequest } from '../services/user/user.schema'
import Boom from  'boom';
import {messages} from '../constants/messages'
import ResponseTransformer from '../helpers/response'
import jwt from 'jsonwebtoken'
import { allServices } from '../services';

const responseTransformer = new ResponseTransformer();

export interface RequestWithUser extends Request {
    user?: IUserRequest;
}

export default async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if(req.headers.authorization){
        const [_,token] = req.headers.authorization.split(' ');

        try{
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as IUserRequest

            const _user = await allServices.userService.getUserByPublicKey({public_id: data.public_id})
            if(_user){
                req.user = _user;
            } else {
                const { output } = Boom.unauthorized('Access token is invalid');
                return responseTransformer.handleError(res, output);
            }
            
        } catch(error) {
            if(error.name === 'TokenExpiredError') {
                const { output } = Boom.unauthorized('Access token is invalid');
                return responseTransformer.handleError(res, output);
            }
            
            const { output } = Boom.unauthorized(messages.UNAUTHORIZED);
            return responseTransformer.handleError(res, output);
        }

        return next()

        // const user = await UserDao.findOne({token: token}).exec();
        
        // if(user){
        //     req.body.user = user._id;
        //     next();
        // } else {
        //     const { output } = Boom.unauthorized(messages.USER_NOT_FOUND);
        //     return responseTransformer.handleError(res, output);
        // }
    }
    else {
        const { output } = Boom.unauthorized(messages.UNAUTHORIZED);
        return responseTransformer.handleError(res, output);
    }
}