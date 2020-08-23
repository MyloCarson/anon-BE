/* eslint-disable @typescript-eslint/no-empty-function */
import UserDao from './userDao';
import { IUser } from './user.schema'
import bycrpt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import crypto from 'crypto'

export class UserService {
    constructor(){}
    
    async create(userObj: IUser): Promise<IUser> {
        const { password } = userObj;
        const hash =  bycrpt.hashSync(password, 10)
        userObj.password = hash;
        const user = await UserDao.create(userObj);
        const userData: IUser = user.toJSON()
        if(userData){
            delete userData.password
            delete userData.email
            delete userData.resetExpire
            delete userData.resetToken
        }
        userData.token = jwt.sign({ public_id: userObj.public_id}, process.env.JWT_SECRET_KEY as string, { expiresIn: process.env.ACCESS_TOKEN_LIFE_SPAN})
        return userData
    }

    async getUser(userObj: Partial<IUser>): Promise<IUser | null>{
        const user = await UserDao.findOne({email: userObj.email}, '-_id -updatedAt').lean();
        const _user = user;
        if(_user){
            _user.token = jwt.sign({ public_id: _user.public_id}, process.env.JWT_SECRET_KEY as string, { expiresIn: process.env.ACCESS_TOKEN_LIFE_SPAN})
        }
        return _user;
    }

    async getUserByPublicKey(userObj: Partial<IUser>): Promise<IUser | null>{
        const user = await UserDao.findOne({public_id: userObj.public_id}, '-updatedAt').lean();
        return user;
    }

    async resetPassword(userObj: Partial<IUser>): Promise<IUser | null>{
        const { password, resetToken } = userObj;
        userObj.token = jwt.sign({ public_id: userObj.public_id}, process.env.JWT_SECRET_KEY as string, { expiresIn: process.env.ACCESS_TOKEN_LIFE_SPAN})
        const hash =  bycrpt.hashSync(password, 10);
        userObj.password = hash;
        const user = await UserDao.findOneAndUpdate({resetToken: resetToken, resetExpire: { $gt: Date.now() }},
        {password: userObj.password, token: userObj.token, resetToken: null, resetExpire: null }).lean()
        const _user = user
        if(_user){
            delete _user?._id
            delete _user?.password
            delete _user?.resetExpire
            delete _user?.resetToken
        }
        return user
    }


    async forgotPassword(userObj: Partial<IUser>): Promise<IUser | null>{
        const resetToken = crypto.randomBytes(160).toString('hex')
        const user = await UserDao.findOneAndUpdate({email: userObj.email}, {resetToken: resetToken, resetExpire:  (Date.now() + 3600000)}).lean()
        return user
    }

    async getAll(): Promise<IUser[]> {
        return await UserDao.find({}, '-password -updatedAt').lean();
    }
}