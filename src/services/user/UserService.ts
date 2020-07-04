import UserDao from './userDao';
import { messages } from '../../constants/messages';
import { IUser } from './user.schema'

export class UserService {
    constructor(){}


    async create(userObj: IUser): Promise<IUser> {
        const user = await UserDao.create(userObj);
        return user.toJSON();
    }

    async getUser(userObj: Partial<IUser>): Promise<IUser|null>{
        const user = await UserDao.findOne({token: userObj.token, secret_question: userObj.secret_question, secret_answer: userObj.secret_answer}, '-id -secret_question -updatedAt').lean();
        return user;
    }

    async getAll(): Promise<IUser[]> {
        return await UserDao.find({}, '-secret_question -updatedAt').lean();
    }
}