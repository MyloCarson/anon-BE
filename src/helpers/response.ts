/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import express, {Response} from 'express';

export interface SuccessResponse {
    status: string;
    data: any;
    statusCode: number;
}

export default class ResponseTransformer {
    constructor() {}

    handleSuccess(res: Response, obj: SuccessResponse): Response {
        const {
            status,
            statusCode,
            data,
        } = obj;
        return res.status(statusCode).json({
            statusCode,
            status,
            data,
        });
    }

    handleError(res: Response, obj: any): Response {
        return res.status(obj.statusCode).json(obj);
    }

    handleErrorCustom(obj: any): Response {
        const res = express.response;
        return res.status(obj.statusCode).json(obj);
    }

}

