import ReviewDao from './reviewDao';
import {IReview, IReviewWithPagination} from './review.schema';
import * as _ from 'lodash';
import { PageParams } from '../../interfaces/page';

export class ReviewService {
    constructor(){}

    async create(reviewObj: IReview): Promise<IReview | null | void> {
        if(!_.isEmpty(reviewObj.company_email)) {
            reviewObj.verifiedByUser = true;
        }
        const review = await ReviewDao.create(reviewObj)
        .then( review => {
            return ReviewDao.findById(review._id)
                .select('-company_email')
                .populate('company', '-_id name')
                .populate('user', '-_id name verified')
                .lean();
        })
        .catch(err => {
            Promise.reject(err)
        })
        
        return review;
    }

    async paginate(pageParams: PageParams): Promise<IReviewWithPagination> {
        const size = parseInt(pageParams.size, 10);
        const page = parseInt(pageParams.page, 10)
        const skip = size * page - size;

        const reviews =  await ReviewDao.find({deletedAt: null})
            .sort({"createdAt": -1})
            .select('-updatedAt -deletedAt -company_email')
            .populate('company', '-_id name')
            .populate('user', '-_id -token -password -email -createdAt -updatedAt -resetExpire -resetToken -_v')
            .lean().skip(skip).limit(size);
        const count = await ReviewDao.find({deletedAt: null}).countDocuments();
        const response: IReviewWithPagination =  {
            reviews: reviews,
            metadata: {
                per_page: size,
                page,
                page_count: reviews.length ? Math.ceil(count/size): 0,
                total_count: count,
                first: (page == 1),
                last: (page * size >= count),
            }
        }
        return response;

    }

    async getAll(): Promise<IReview[]> {
        return await ReviewDao.find({deletedAt: null})
            .sort({"createdAt": -1})
            .select('-updatedAt -deletedAt -company_email')
            .populate('company', '-_id name')
            .populate('user', '-_id -token -password -email -createdAt -updatedAt -resetExpire -resetToken -_v')
            .lean();

    }

    async getReview(id: string): Promise<IReview | null> {
        return await ReviewDao.findOne({_id: id, deletedAt: null})
            .select('-updatedAt -deletedAt -company_email')
            .populate('company', '-_id name')
            .populate('user', '-_id -token -password -email -createdAt -updatedAt -resetExpire -resetToken -_v')
            .lean();
    }

    async searchReview(searchTerm: string): Promise<IReview[]> {
        const reviews: IReview[] = await ReviewDao.find({deletedAt: null})
            .populate({
                path: 'company',
                match: { name: { $regex: '^'+searchTerm, $options: "xi" }},
                select: '-_id name'
            })
            .select('-updatedAt -deletedAt -company_email')
            .populate('user', '-_id -token -password -email -createdAt -updatedAt -resetExpire -resetToken -_v')
            .lean();
        return reviews.filter( review => review.company !== null)
    }

    async remove(reviewID: string): Promise<boolean> {
        const review = await ReviewDao.findByIdAndUpdate(reviewID, {deletedAt: new Date()});
        if(!review){
            return false;
        }

        return true;
    }
}