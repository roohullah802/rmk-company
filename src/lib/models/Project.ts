import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  location: string;
  timeline: string;
  status: 'planning' | 'ongoing' | 'completed';
  images: string[];
  companyId?: mongoose.Types.ObjectId;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    timeline: { type: String, required: true },
    status: {
      type: String,
      enum: ['planning', 'ongoing', 'completed'],
      default: 'planning',
    },
    images: [{ type: String }],
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
