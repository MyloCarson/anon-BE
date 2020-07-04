import {allServices} from '../../services';
import {Request, Response, NextFunction} from 'express';
import ResponseTransformer from '../../helpers/response';
import Boom from 'boom';
import {messages} from '../../constants/messages';
import logger from '../../utils/winston';
import { ISector } from '../../services/sector/sector.schema';
import validate from "validate.js";

const responseTransformer = new ResponseTransformer();

export const validateCreateSector = async (req: Request, res: Response, next: NextFunction) => {
    const {body} = req;
    const errors = validate(body, {
        'name': {
            presence: true,
            length: {
                minimum: 4,
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

    const sectorObj = body as ISector;
    allServices.sectorService.getSector(sectorObj)
    .then( result => {
        if(result) {

            return responseTransformer.handleError(res,{
                message: messages.SECTOR_EXIST,
                statusCode: 400
            })
            
        }

        return next();
        
    })
    .catch( error => {
        logger.error('Sector Create Validation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}

// export const validateFetchSector = async (req: Request, res: Response, next: NextFunction) => {
//     const { name }
// }