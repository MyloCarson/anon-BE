import {allServices} from '../../services';
import {Request, Response, NextFunction} from 'express';
import ResponseTransformer from '../../helpers/response';
import Boom from 'boom';
import {messages} from '../../constants/messages';
import logger from '../../utils/winston';
import validate from "validate.js";


const responseTransformer = new ResponseTransformer();

export const validateCreateCompany  = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validate(req.body, {
        name: {
            presence: true,
            length: {
                minimum: 4
            },
            type: 'string' 
        },
        location: {
            type: 'string' 
        },
        sector: {
          presence: true,
          type: 'string',
          length: {
            minimum: 22
            },  
        },
    });

    if (errors) {
        return responseTransformer.handleError(res,{
            message: errors,
            statusCode: 400
        })
    }
        const {name} = req.body;
        allServices.companyService.getCompany(name)
        .then( result => {
            
            if (!result) {
                return next();
              }
      
            return responseTransformer.handleError(res,{
                message: messages.COMPANY_EXIST,
                statusCode: 400
            })
        })
        .catch(error => {
            logger.error('Company Create Validation error: %o', error);
            const {output} = Boom.badRequest(error);
            return responseTransformer.handleError(res, output)
        })
    
  
}

export const validateFetchCompany = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    allServices.companyService.getCompany(name)
    .then( result => {
        if(!result){
            return responseTransformer.handleError(res,{
                message: messages.COMPANY_DONT_EXIST,
                statusCode: 404
            })
        }
        return next();
    })
    .catch( error => {
        logger.error('Company Fetch Validation error: %o', error);
        const {output} = Boom.badRequest(error);
        return responseTransformer.handleError(res, output)
    })
}