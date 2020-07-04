import express from 'express';
import * as CommentController from '../controllers/comment/controller';
import { validateCreateComment, validateGetReviewComments } from '../validations/comment/validate';

const CommentRoute = express.Router();
CommentRoute.post('/', validateCreateComment, CommentController.create);
CommentRoute.get('/review/:review', validateGetReviewComments, CommentController.getCommentByReview);
CommentRoute.get('/all', CommentController.getAll);

export default CommentRoute