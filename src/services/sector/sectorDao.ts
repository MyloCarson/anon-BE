import mongoose, { Schema, Document } from 'mongoose';
import { ISector } from './sector.schema';

export interface ISectorModel extends ISector, Document {}
const sectorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const SectorSchema = mongoose.model<ISectorModel>('Sector', sectorSchema);

export default SectorSchema;