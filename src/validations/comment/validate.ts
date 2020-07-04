import {Request, Response, NextFunction} from 'express';
import ResponseTransformer from '../../helpers/response';
import validate from "validate.js";
import { IComment } from '../../services/comment/comment.schema';
import { randomName } from '../../constants/randomNames';
import {v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';


const responseTransformer = new ResponseTransformer();

export const validateCreateComment  = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validate(req.body, {
        comment: {
            presence: true,
            type: 'string',
            length: {
                maximum: 160,
            }
        },
        review: {
            type: 'string',
            presence: true,
            length: {
                minimum: 22
            }
        },
        author: ''
    })

    if (errors) {
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }
    const commentObj = req.body as IComment;
    if(_.isEmpty(commentObj.author)){
        const suffix = uuidv4();
        commentObj.author = `${randomName()}@${suffix.substr(0, suffix.indexOf('-'))}`;
        req.body = commentObj; //updates the request body
    }
    return next();
}

export const validateGetReviewComments  = async (req: Request, res: Response, next: NextFunction) => {
    const {review} = req.params;
    
    const errors = validate.single(review, {
        type: 'string',
        presence: true,
        length: {
            minimum: 22
        }
    })

    if (errors) {
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }

    return next()
}