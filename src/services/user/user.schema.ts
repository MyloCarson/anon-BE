export interface IUser {
    name: string;
    token: string;
    verified: boolean;
    secret_answer: string;
    secret_question: string;
}