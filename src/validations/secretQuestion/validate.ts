import {allServices} from '../../services';
import {Request, Response, NextFunction} from 'express';
import ResponseTransformer from '../../helpers/response';
import Boom from 'boom';
import {messages} from '../../constants/messages';
import logger from '../../utils/winston';
import { ISecretQuestion } from '../../services/secretQuestion/secretQuestion.schema';
import validate from "validate.js";


const responseTransformer = new ResponseTransformer();

export const validateCreateQuestion = async (req: Request, res: Response, next: NextFunction) => {
    const {body} = req;
    const errors = validate(body, {
        'question': {
            presence: true,
            length: {
                minimum: 12,
            },
            type: 'string' 
        }
    })
    if (errors) {
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }

    const questionObj = body as ISecretQuestion;
    allServices.secretQuestionService.getQuestion(questionObj)
    .then( result => {
        if(result) {

            return responseTransformer.handleError(res,{
                message: messages.QUESTION_EXIST,
                statusCode: 400
            })
            
        }

        return next();
        
    })
    .catch( error => {
        logger.error('Question Create Validation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}