import express from 'express';
import * as ReviewController from '../controllers/review/controller';
import userAuth from '../middleware/userAuth';
import { validateCreateReview, validateFetchReview, validateReviewPagination } from '../validations/review/validate';

const ReviewRoute = express.Router();

ReviewRoute.post('/search', ReviewController.search);
ReviewRoute.post('/', userAuth, validateCreateReview, ReviewController.create);
ReviewRoute.get('/newest/:size/:page', validateReviewPagination, ReviewController.newest);
ReviewRoute.get('/trending/:size/:page', ReviewController.trending);
ReviewRoute.get('/:size/:page', validateReviewPagination, ReviewController.paginateAll);
ReviewRoute.get('/all', ReviewController.getAll);
ReviewRoute.get('/:id', validateFetchReview, ReviewController.getReview);
ReviewRoute.delete('/:id', validateFetchReview, ReviewController.remove);
ReviewRoute.post('/verifyEmail', ReviewController.checkCompanyEmail);

export default ReviewRoute;