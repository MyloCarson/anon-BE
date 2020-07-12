import express from 'express';
import * as ReviewController from '../controllers/review/controller';
import userAuth from '../middleware/userAuth';
import { validateCreateReview, validateFetchReview, validateReviewPagination } from '../validations/review/validate';

const ReviewRoute = express.Router();

ReviewRoute.post('/search', ReviewController.search);
ReviewRoute.post('/', userAuth, validateCreateReview, ReviewController.create);
ReviewRoute.get('/:size/:page', validateReviewPagination, ReviewController.paginate);
ReviewRoute.get('/all', ReviewController.getAll);
ReviewRoute.get('/:id', validateFetchReview, ReviewController.getReview)
ReviewRoute.delete('/:id', validateFetchReview, ReviewController.remove);

export default ReviewRoute;