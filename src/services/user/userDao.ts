import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.schema';

export interface IUserModel extends IUser, Document {}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    public_id:{
      type: String,
      required: true
    },
    resetToken: {
      type: String,
      default: null
    },
    resetExpire: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)
userSchema.path('email').validate(async (value: string) => {
  const emailCount = await mongoose.models.User.countDocuments({email: value });
  return !emailCount;
}, 'Email already exists');

const UserSchema = mongoose.model<IUserModel>('User', userSchema);

export default UserSchema;
