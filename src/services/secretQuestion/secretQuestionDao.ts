import mongoose, { Schema, Document } from 'mongoose';
import {ISecretQuestion} from './secretQuestion.schema';

export interface ISecretQuestionModel extends ISecretQuestion, Document {}

const secretQuestionSchema: Schema = new Schema(
    {
        question: {
            type: String,
            required: true,
            unique: true,
            index: true
        }
    }, {
        timestamps: true
    }
);

const SecretQuestionSchema = mongoose.model<ISecretQuestionModel>('SecretQuestion', secretQuestionSchema);

export default SecretQuestionSchema;