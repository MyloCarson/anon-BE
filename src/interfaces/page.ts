export interface PageParams {
    size: string;
    page: string;
}

export interface PageMetaData {
    per_page: number;
    page: number;
    page_count: number;
    total_count: number,
    first: boolean;
    last: boolean;
}
