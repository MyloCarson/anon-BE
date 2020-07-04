import express from 'express';
import * as QuestionController from '../controllers/secretQuestion/controller';
import { validateCreateQuestion } from '../validations/secretQuestion/validate';

const QuestionRoute = express.Router();
QuestionRoute.post('/', validateCreateQuestion, QuestionController.create);
QuestionRoute.get('/all', QuestionController.getAll);


export default QuestionRoute;