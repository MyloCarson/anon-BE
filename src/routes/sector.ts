import express from 'express';
import * as SectorController from '../controllers/sector/controller';
import { validateCreateSector } from '../validations/sector/validate';

const SectorRoute = express.Router();

SectorRoute.post('/', validateCreateSector, SectorController.create);
SectorRoute.get('/all', SectorController.getAll)


export default SectorRoute;