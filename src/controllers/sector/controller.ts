import { Request, Response } from "express";
import {allServices} from '../../services';
import * as _ from 'lodash';
import Boom from  'boom';
import {messages} from '../../constants/messages'
import ResponseTransformer, { SuccessResponse } from '../../helpers/response';
import logger from '../../utils/winston';
import httpCodes from 'http-status-codes';
import { ISector } from '../../services/sector/sector.schema';

const responseTransformer = new ResponseTransformer();

export const create = (req: Request, res: Response): unknown => {
    const _sector = req.body as ISector;

    if(_.isEmpty(_sector)){
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }
    

    allServices.sectorService.create(_sector)
    .then(result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.CREATED,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch(error => {
        logger.error('Sector Creation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

export const getAll = (req: Request, res: Response) => {
    allServices.sectorService.getAll()
    .then( result => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS,
        }
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch(error => {
        logger.error('Sector Creation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}