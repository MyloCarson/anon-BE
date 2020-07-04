export interface IReview {
    review: string[];
    user: string;
    company_email: string;
    verifiedByUser: boolean;
    verifiedByAdmin: boolean;
    deletedAt: Date | null;
}