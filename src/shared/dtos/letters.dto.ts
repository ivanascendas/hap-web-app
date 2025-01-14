import { PaggingResponse } from "./pagging-base.request";

export interface LettersQueryParams {
  take?: number;
  skip?: number;
  idFrom?: string;
  idTo?: string;
  IncDept?: string;
}

export interface LettersDto {
  aparId: number;
  expirationDate: string;
  customerNumber: number;
  authorityId: number | null;
  authorityDescription: string | null;
  customerName: string;
  address: string;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  addressBlock: string | null;
  town: string;
  county: string;
  drNumber: string | null;
  dNumber: string | null;
  revcoll: string | null;
  revcollName: string | null;
  revcollAddress: string | null;
  revcolPhone: string | null;
  revcollEmail: string | null;
  zipcode: string | null;
  tempPassword: string;
}

export interface LettersResponse extends PaggingResponse<LettersDto> {}
