import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITestimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export interface ICmsSettings extends Document {
  homeStats: {
    excavators: string;
    projects: string;
    companies: string;
    experience: string;
  };
  aboutContent: string;
  heroTagline: string;
  testimonials: ITestimonial[];
  featuredProjects: mongoose.Types.ObjectId[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CmsSettingsSchema = new Schema<ICmsSettings>(
  {
    homeStats: {
      excavators: { type: String, default: '30+' },
      projects: { type: String, default: '20+' },
      companies: { type: String, default: '3+' },
      experience: { type: String, default: '10+' },
    },
    aboutContent: {
      type: String,
      default: 'RMK is a leading heavy machinery company specializing in excavation and large-scale construction projects.',
    },
    heroTagline: {
      type: String,
      default: 'Powering Pakistan\'s Largest Construction Projects',
    },
    testimonials: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        company: { type: String, required: true },
        content: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, default: 5 },
      },
    ],
    featuredProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    contactInfo: {
      phone: { type: String, default: '+92 300 0000000' },
      email: { type: String, default: 'info@rmk.com' },
      address: { type: String, default: 'Lahore, Pakistan' },
    },
  },
  { timestamps: true }
);

const CmsSettingsModel: Model<ICmsSettings> =
  mongoose.models.CmsSettings ||
  mongoose.model<ICmsSettings>('CmsSettings', CmsSettingsSchema);

export default CmsSettingsModel;
