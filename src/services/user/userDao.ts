import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.schema';

export interface IUserModel extends IUser, Document {}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    token: {
      type: String,
      required: true,
      default: ''
    },
    verified: {
      type: Boolean,
      default: false
    },
    secret_question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SecretQuestion',
      required: [true, 'A secret question is required.']
    },
    secret_answer: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const UserSchema = mongoose.model<IUserModel>('User', userSchema);

export default UserSchema;
