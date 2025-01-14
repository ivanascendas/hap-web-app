import { PaggingBaseDto, PaggingResponse } from "./pagging-base.request";

export interface CustomerDto {
  cust_name: string;
  isActive: boolean;
  id: string;
  email: string;
  phoneNumber: string;
  lockoutEndDateUtc: string | null;
  lockoutEnabled: boolean;
  userName: string;
  customerNumber: number;
  customerName: string;
  address: string;
  town: string;
  county: string;
  drNumber: string;
  dNumber: string;
}

export interface CustomerQueryParams extends PaggingBaseDto {
  incDepts: string;
}

export interface CustomerUpdateDto {
  customerNumber: number;
  isActive?: boolean;
  PhoneNumber?: string;
  Email?: string;
}
