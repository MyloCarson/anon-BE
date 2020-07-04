import { CompanyService } from './company/CompanyService';
import {SectorService} from './sector/SectorService';
import {UserService} from './user/UserService';
import { SecretQuestionService } from './secretQuestion/SecretQuestionService';
import { ReviewService } from './review/ReviewService';
import { CommentService } from './comment/CommentService';

export interface ServiceContainer {
    companyService: CompanyService,
    sectorService: SectorService,
    userService: UserService,
    secretQuestionService: SecretQuestionService,
    reviewService: ReviewService,
    commentService: CommentService
}

export const allServices: ServiceContainer = {
    companyService: new CompanyService(),
    sectorService: new SectorService(),
    userService: new UserService(),
    secretQuestionService: new SecretQuestionService(),
    reviewService: new ReviewService(),
    commentService: new CommentService()
}