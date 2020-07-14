import { Request, Response } from 'express';
import { allServices } from '../../services';
import { IReview } from '../../services/review/review.schema';
import * as _ from 'lodash';
import Boom from 'boom';
import { messages } from '../../constants/messages';
import ResponseTransformer, { SuccessResponse } from '../../helpers/response';
import logger from '../../utils/winston';
import httpCodes from 'http-status-codes';
import mongoose from 'mongoose';
import {ICompany} from '../../services/company/company.schema';
import { RequestWithUser } from '../../middleware/userAuth';
import { PageParams } from '../../interfaces/page';
import { Socket } from '../../server'


const responseTransformer = new ResponseTransformer();
interface IReviewWithSector extends IReview {
    sector: string;
}

const createReview = (reviewObj: IReviewWithSector, res: Response) => {
    allServices.reviewService
        .create(reviewObj)
        .then((result) => {
            const responseObj: SuccessResponse = {
                data: result,
                statusCode: httpCodes.CREATED,
                status: messages.SUCCESS
            };
            Socket.emit('new-review', result)
            return responseTransformer.handleSuccess(res, responseObj);
        })
        .catch((error) => {
            logger.error('Review Creation error: %o', error);
            const { output } = Boom.badRequest(error);
            return responseTransformer.handleError(res, output);
        });
}

export const create = (req: RequestWithUser, res: Response): unknown => {
    const reviewObj = req.body as IReviewWithSector;

    if (_.isEmpty(reviewObj)) {
        const { output } = Boom.preconditionRequired(messages.ALL_REQUIRED);
        return responseTransformer.handleError(res, output);
    }

    // get user from the request
    if (req.user && req.user._id) {
        reviewObj.user = req.user._id;
    }
    const companyObj: ICompany = { name: reviewObj.company, sector: reviewObj.sector };

    //ObjectId starts from 12 bytes above
    // check if company is random string such as name of company or an ObjectId
    if (reviewObj.company.length > 11 && (new mongoose.Types.ObjectId(reviewObj.company).toString() === reviewObj.company)) {
        createReview(reviewObj, res)
    }
    else {
        allServices.companyService.create(companyObj)
            .then(company => {
                reviewObj.company = company._id;
                createReview(reviewObj, res)
                // console.log('RVi', reviewObj)
            })
            .catch(error => {
                logger.error('Company Creation in Review error: %o', error);
                const { output } = Boom.badRequest(error);
                return responseTransformer.handleError(res, output)
            })
    }
};

export const getReview = (req: Request, res: Response) => {
    const { id } = req.params;
    allServices.reviewService
        .getReview(id)
        .then((result) => {
            const responseObj: SuccessResponse = {
                data: result,
                statusCode: httpCodes.OK,
                status: messages.SUCCESS
            };
            return responseTransformer.handleSuccess(res, responseObj);
        })
        .catch((error) => {
            logger.error('Review GET error: %o', error);
            const { output } = Boom.badRequest(error);
            return responseTransformer.handleError(res, output);
        });
};

export const remove = (req: Request, res: Response) => {
    const { id } = req.params;
    allServices.reviewService
        .remove(id)
        .then((result) => {
            const responseObj: SuccessResponse = {
                data: result,
                statusCode: httpCodes.OK,
                status: messages.SUCCESS
            };
            return responseTransformer.handleSuccess(res, responseObj);
        })
        .catch((error) => {
            logger.error('Review remove : %o', error);
            const { output } = Boom.badRequest(error);
            return responseTransformer.handleError(res, output);
        });
};

export const paginate = (req: Request, res: Response) => {
    const { size, page} = req.params
    const pageParams: PageParams = { size, page} 
    allServices.reviewService
        .paginate(pageParams)
        .then((result) => {
            const responseObj: SuccessResponse = {
                data: result,
                statusCode: httpCodes.OK,
                status: messages.SUCCESS
            };
            return responseTransformer.handleSuccess(res, responseObj);
        })
        .catch((error) => {
            logger.error('Review GET ALL : %o', error);
            const { output } = Boom.badRequest(error);
            return responseTransformer.handleError(res, output);
        });
};

export const getAll = (req: Request, res: Response) => {
    allServices.reviewService
        .getAll()
        .then((result) => {
            const responseObj: SuccessResponse = {
                data: result,
                statusCode: httpCodes.OK,
                status: messages.SUCCESS
            };
            return responseTransformer.handleSuccess(res, responseObj);
        })
        .catch((error) => {
            logger.error('Review GET ALL : %o', error);
            const { output } = Boom.badRequest(error);
            return responseTransformer.handleError(res, output);
        });
};

export const search = (req:Request, res: Response) => {
    allServices.reviewService
    .searchReview(req.body.search)
    .then((result) => {
        const responseObj: SuccessResponse = {
            data: result,
            statusCode: httpCodes.OK,
            status: messages.SUCCESS
        };
        return responseTransformer.handleSuccess(res, responseObj);
    })
    .catch((error) => {
        logger.error('Review GET ALL : %o', error);
        const { output } = Boom.badRequest(error);
        return responseTransformer.handleError(res, output);
    });
}
