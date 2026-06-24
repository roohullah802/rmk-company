import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorker extends Document {
  name: string;
  cnic: string;
  drivingLicense: string;
  contact: string;
  email: string;
  assignedMachine: string;
  experience: number;
  status: 'active' | 'on-leave' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema = new Schema<IWorker>(
  {
    name: { type: String, required: true },
    cnic: { type: String, required: true },
    drivingLicense: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    assignedMachine: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['active', 'on-leave', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const WorkerModel: Model<IWorker> =
  mongoose.models.Worker || mongoose.model<IWorker>('Worker', WorkerSchema);

export default WorkerModel;
