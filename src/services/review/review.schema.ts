import { PageMetaData } from "../../interfaces/page";

export interface IReview {
    company: string;
    review: string[];
    user: string;
    company_email: string;
    verifiedByUser: boolean;
    verifiedByAdmin: boolean;
    deletedAt: Date | null;
}

export interface IReviewWithPagination {
    reviews: IReview[],
    metadata: PageMetaData
}