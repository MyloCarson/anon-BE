import CommentDao from './commentDao';
import { IComment } from './comment.schema';
import * as _ from 'lodash';

export class CommentService {
    constructor(){}

    async create(commentObj: IComment): Promise<IComment> {
        return await (await CommentDao.create(commentObj)).toJSON();
    }

    async getCommentByReview(review: string): Promise<IComment[]>{
        return await CommentDao.find({review: review}).lean();
    }

    async getAll(): Promise<IComment[]>{
        return await CommentDao.find({}).lean();
    }
}