export interface IUser {
    name: string;
    token?: string;
    verified?: boolean;
    email: string;
    password: string;
    public_id: string;
    resetToken?: string|null;
    resetExpire?: number|null;
}

export interface IUserRequest extends IUser{
    _id?: string;
}