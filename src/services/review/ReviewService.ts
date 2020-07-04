import ReviewDao from './reviewDao';
import {IReview} from './review.schema';
import * as _ from 'lodash';

export class ReviewService {
    constructor(){}

    async create(reviewObj: IReview): Promise<IReview | null | void> {
        if(!_.isEmpty(reviewObj.company_email)) {
            reviewObj.verifiedByUser = true;
        }
        const review = await ReviewDao.create(reviewObj)
        .then(review => {
            return ReviewDao.findById(review._id)
                .select('-company_email')
                .populate('user', '-_id name verified')
                .lean();
        })
        .catch(err => {
            Promise.reject(err)
        })
        
        return review;
    }

    async getAll(): Promise<IReview[]> {
        return await ReviewDao.find({deletedAt: null})
            .populate('user', '-_id -token -secret_answer -secret_question')
            .lean();
    }

    async getReview(id: string): Promise<IReview | null> {
        return await ReviewDao.findOne({_id: id, deletedAt: null})
            .populate('user', '-_id -token -secret_answer -secret_question')
            .lean();
    }

    async remove(reviewID: string): Promise<boolean> {
        const review = await ReviewDao.findByIdAndUpdate(reviewID, {deletedAt: new Date()});
        if(!review){
            return false;
        }

        return true;
    }
}