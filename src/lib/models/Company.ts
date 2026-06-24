import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  description: string;
  logo: string;
  contact: string;
  email: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, default: '' },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
  },
  { timestamps: true }
);

const CompanyModel: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default CompanyModel;
