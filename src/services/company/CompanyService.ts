import CompanyDao, { ICompanyModel } from './companyDao'
import { ICompany, ICompanyWithID } from './company.schema';

export class CompanyService {
    constructor(){ }

    async allCompanies (): Promise<ICompany[]> {
        const companies: ICompany[] =  await CompanyDao.find({}, '-updatedAt')
            .sort({ createdAt: "desc" })
            .populate('sector', '-_id name')
            .lean();
        return companies;
    }

    async create (companyObj: ICompany): Promise<ICompanyModel | ICompanyWithID> {
        const company = await CompanyDao.create({
            name: companyObj.name,
            location: companyObj.location,
            sector: companyObj.sector
        });
        
        await company.populate('sector', '-_id name').execPopulate();
        return company.toJSON();
    }

    async getCompany (name: string): Promise<ICompany | null> {
        const company = await CompanyDao.findOne({name: name})
            .populate('sector', '-_id name')
            .lean();
        return company;
    }
}
