/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response, NextFunction} from 'express';
import ResponseTransformer from '../../helpers/response';
import validate from "validate.js";
import * as _ from 'lodash';

const responseTransformer = new ResponseTransformer();


validate.validators.array = (arrayItems: string[], constraints: any): any => {
    const allErrors: any[] = [];

    arrayItems.map( item => {
        const error = validate.single(item, constraints);
        if(error) allErrors.push(error);
    })
    return allErrors;
}

export const validateCreateReview = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validate(req.body, {
        review: {
            type: 'array',
            presence: true,
            array: {
                type: 'string',
                length: {
                    minimum: 10,
                    maximum: 160, // each review shouldn't be more than 160 characters
                    tooShort: "A review is too short (minimum is %{count} characters)",
                    tooLong: "A review is too long (maximum is %{count}  characters)"
                }
            }
        },
        user: {},
        company_email: '',
        // company_email: {
        //     // email: true
        //     // TODO: email should be check if present
        // },
        sector: {
            type: 'string',
            presence: true,
            length: {
                minimum: 22
            }
        },
        company: {
            type: 'string',
            presence: true,
        }
    });

    if (errors) {
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }

    return next();
}

export const validateFetchReview = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const errors = validate.single(id, {
        type: 'string',
        presence: true,
        length: {
            minimum: 22,
            tooShort: "ID needs to have %{count} words or more",
        }
    })
    if (errors) {
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }

    return next();
}

export const validateReviewPagination = async (req: Request, res: Response, next: NextFunction) => {
    const {size, page } = req.params
    const errors = validate({ size, page}, {
        size: { presence: true, type: 'string'},
        page: { presence: true, type: 'string'}
    })
    if (errors) {
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }

    return next();
}