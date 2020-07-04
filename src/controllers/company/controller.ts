import { Request, Response } from "express";
import {allServices} from '../../services';
import { ICompany } from "../../services/company/company.schema";
import * as _ from 'lodash';
import Boom from  'boom';
import {messages} from '../../constants/messages'
import ResponseTransformer, { SuccessResponse } from '../../helpers/response';
import logger from '../../utils/winston';
import httpCodes from 'http-status-codes';

const responseTransformer = new ResponseTransformer();

export const create = (req: Request, res: Response): unknown => {
    const company = req.body as ICompany;
    if(_.isEmpty(company)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }
    allServices.companyService.create(company)
    .then( result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.CREATED,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Company Creation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const fetch =  (req: Request, res: Response): unknown => {
    const {name} = req.params;
    if(_.isEmpty(name)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }

    allServices.companyService.getCompany(name)
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Company Get error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const getAll =  (req: Request, res: Response) => {
    allServices.companyService.allCompanies()
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch( error => {
        logger.error('Company Get error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}
