import mongoose, {Schema, Document} from 'mongoose';
import {IReview} from './review.schema';

export interface IReviewModel extends IReview, Document {}

const reviewSchema: Schema = new Schema(
    {
        review: [{
            type: String,
            required: true
        }],
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'A review belongs to a company.']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A review belongs to a user.']
        },
        company_email: {
            type: String
        },
        verifiedByUser: {
            type: Boolean,
            default: false
        },
        verifiedByAdmin: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
      timestamps: true
    }
);

const ReviewSchema  = mongoose.model<IReviewModel>('Review', reviewSchema);

export default ReviewSchema;