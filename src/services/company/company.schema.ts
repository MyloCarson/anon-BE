
export interface ICompany {
    name: string;
    location?: string;
    sector: string;
}

export interface ICompanyWithID extends ICompany {
  _id: string
}