import SecretQuestion from './secretQuestionDao';
import { messages } from '../../constants/messages';
import { ISecretQuestion } from './secretQuestion.schema';

export class SecretQuestionService {
    constructor(){}

    async create (questionObj: ISecretQuestion): Promise<ISecretQuestion> {
        const _secretQuestion = await SecretQuestion.create(questionObj);
        return _secretQuestion.toJSON();
    }

    async getAll(): Promise<ISecretQuestion[]>{
        return SecretQuestion.find({}, '-updatedAt').lean();
    }
    async getQuestion (questionObj: ISecretQuestion): Promise<ISecretQuestion | null> {
        return await SecretQuestion.findOne({question: questionObj.question}).lean()
    }
}
