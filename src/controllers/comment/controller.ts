import { Request, Response } from "express";
import {allServices} from '../../services';
import { IComment } from "../../services/comment/comment.schema";
import * as _ from 'lodash';
import Boom from  'boom';
import {messages} from '../../constants/messages'
import ResponseTransformer, { SuccessResponse } from '../../helpers/response';
import logger from '../../utils/winston';
import httpCodes from 'http-status-codes';
import { Socket } from '../../server'
const responseTransformer = new ResponseTransformer();

export const create = (req: Request, res: Response): unknown => {
    const commentObj = req.body as IComment;
    
    if(_.isEmpty(commentObj)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }
    allServices.commentService.create(commentObj)
    .then( result => {
        allServices.reviewService.updateNumberOfComments(commentObj.review); // updates the metrics for counting trending
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.CREATED,
            status: messages.SUCCESS,
        }
        Socket.emit('new-comment', responseObj) //sends new comments over socket
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Comment Creation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const getCommentByReview = (req: Request, res: Response) => {
    const {review} = req.params;
    allServices.commentService.getCommentByReview(review)
    .then( result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Comment GET BY REVIEW error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const getAll = (req: Request, res: Response) => {
    allServices.commentService.getAll()
    .then( result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Comment GET BY REVIEW error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}
