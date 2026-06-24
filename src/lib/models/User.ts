import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'manager', 'viewer'],
      default: 'viewer',
    },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
