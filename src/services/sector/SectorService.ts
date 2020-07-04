import SectorDao from './sectorDao';
import { messages } from '../../constants/messages';
import { ISector } from './sector.schema';

export class SectorService {
    constructor() {}

    async create (sectorObj: ISector): Promise<ISector> {
        const _sector = await SectorDao.findOne({name: sectorObj.name}).lean();
        
        if(_sector){
            throw new Error(messages.SECTOR_EXIST);
        }

        const sector = await SectorDao.create({name: sectorObj.name});
        return sector.toJSON();
    }

    async getAll (): Promise<ISector[]> {
        const sectors: ISector[] = await SectorDao.find({}, '-updatedAt')
            .sort({ name: "desc" })
            .lean();
        return sectors;
    }

    async getSector (sectorObj: ISector): Promise<ISector | null> {
        const _sector = await SectorDao.findOne({name: sectorObj.name}).lean();
        
        if(_sector){
            const sectorResponse: ISector = {
                name: _sector.name
            }
            return sectorResponse;
        }

        return null;
        
    }
}