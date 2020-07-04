import { Request, Response, NextFunction} from "express";
import UserDao from '../services/user/userDao';
import Boom from  'boom';
import {messages} from '../constants/messages'
import ResponseTransformer from '../helpers/response';

const responseTransformer = new ResponseTransformer();

export default async (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization){
        const [_,token] = req.headers.authorization.split(' ');

        const user = await UserDao.findOne({token: token}).exec();
        
        if(user){
            req.body.user = user._id;
            next();
        } else {
            const { output } = Boom.unauthorized(messages.USER_NOT_FOUND);
            return responseTransformer.handleError(res, output);
        }
    }
    else {
        const { output } = Boom.unauthorized(messages.UNAUTHORIZED);
        return responseTransformer.handleError(res, output);
    }
}