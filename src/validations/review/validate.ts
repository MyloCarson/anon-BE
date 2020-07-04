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
                    maximum: 160 // each review shouldn't be more than 160 characters
                }
            }
        },
        user: {
            presence: true,
        },
        company_email: {
            type: 'string',
            email: true
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