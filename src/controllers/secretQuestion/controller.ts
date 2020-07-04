import { Request, Response } from "express";
import {allServices} from '../../services';
import { ISecretQuestion } from "../../services/secretQuestion/secretQuestion.schema";
import * as _ from 'lodash';
import Boom from  'boom';
import {messages} from '../../constants/messages'
import ResponseTransformer, { SuccessResponse } from '../../helpers/response';
import logger from '../../utils/winston';
import httpCodes from 'http-status-codes';

const responseTransformer = new ResponseTransformer();

export const create = (req: Request, res: Response): unknown => {
    const questionObj = req.body  as ISecretQuestion;

    if(_.isEmpty(questionObj)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }
    allServices.secretQuestionService.create(questionObj)
    .then( result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.CREATED,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Question Creation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const getAll = (req: Request, res: Response) => {
    allServices.secretQuestionService.getAll()
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Question Get error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}