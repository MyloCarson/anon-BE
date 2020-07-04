import mongoose, {Schema, Document} from 'mongoose';
import {IComment} from './comment.schema';

export interface ICommentModel extends IComment, Document {}

const commentSchema: Schema = new Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            required: [true, 'A comment belongs to a review.']
        },
        author: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

const CommentSchema = mongoose.model<ICommentModel>('Comment', commentSchema);

export default CommentSchema;