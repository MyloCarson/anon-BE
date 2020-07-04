import mongoose, { Schema, Document } from 'mongoose';
import { ICompany } from './company.schema';

export interface ICompanyModel extends ICompany, Document {}

const companySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A company must have a name.']
    },
    location: { type: String, default: '' },
    sector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sector',
      required: [true, 'A company belongs to a sector.']
    }
  },
  {
    timestamps: true
  }
);

const CompanyDao = mongoose.model<ICompanyModel>('Company', companySchema);

export default CompanyDao;
