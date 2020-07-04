import express from 'express';
import * as ReviewController from '../controllers/review/controller';
import userAuth from '../middleware/userAuth';
import { validateCreateReview, validateFetchReview } from '../validations/review/validate';

const ReviewRoute = express.Router();

ReviewRoute.post('/', userAuth, validateCreateReview, ReviewController.create);
ReviewRoute.get('/all', ReviewController.getAll);
ReviewRoute.get('/:id', validateFetchReview, ReviewController.getReview)
ReviewRoute.delete('/:id', validateFetchReview, ReviewController.remove);

export default ReviewRoute;