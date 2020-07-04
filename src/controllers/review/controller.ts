import { Request, Response } from "express";
import {allServices} from '../../services';
import { IReview } from "../../services/review/review.schema";
import * as _ from 'lodash';
import Boom from  'boom';
import {messages} from '../../constants/messages'
import ResponseTransformer, { SuccessResponse } from '../../helpers/response';
import logger from '../../utils/winston';
import httpCodes from 'http-status-codes';

const responseTransformer = new ResponseTransformer();

export const create = (req: Request, res: Response): unknown => {
    const reviewObj = req.body as IReview;
    
    if(_.isEmpty(reviewObj)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }
    allServices.reviewService.create(reviewObj)
    .then( result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.CREATED,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Review Creation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const getReview = (req: Request, res: Response) => {
    const {id} = req.params
    allServices.reviewService.getReview(id)
    .then( result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Review GET error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const remove = (req: Request, res: Response) => {
    const {id} = req.params;
    allServices.reviewService.remove(id)
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Review remove : %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const getAll = (req: Request, res: Response) => {
    allServices.reviewService.getAll()
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Review GET ALL : %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}