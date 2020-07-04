import express from 'express';
import * as CompanyController from '../controllers/company/controller';
import { validateCreateCompany, validateFetchCompany} from '../validations/company/validate'

const CompanyRoute: express.Router = express.Router();

CompanyRoute.post('/', validateCreateCompany, CompanyController.create)
CompanyRoute.get('/all', CompanyController.getAll);
CompanyRoute.get('/:name', validateFetchCompany, CompanyController.fetch);


export default CompanyRoute;