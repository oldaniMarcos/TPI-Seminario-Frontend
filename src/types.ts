import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Options {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  context?: HttpContext;
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?: {
    includeHeaders?: string[];
  } | boolean;
}

export interface Breed {
  id?: number,
  description: string,
  speciesId: number,
}

export interface CashFlow {
  id?: number,
  closeDate: string | null,
  closeType: string,
  initialAmount: number,
  inflows: number,
  outflows: number,
}

export interface Client {
  id?: number,
  docNum: string,
  docType: string,
  fullName: string,
  phone: string,
  address: string,
  state: 'alta' | 'baja',

  petsCount?: number,
}

export interface Installment {
  id?: number,
  dueDate: string,
  amount: number,
  payDate: string,
  visitId: string,
}

export interface Lot {
  id?: number,
  units: number,
  lotNumber: string,
  dueDate: string,
  supplyTypeId: number,
}

export interface Pet {
  id?: number,
  age: number,
  name: string,
  birthDate: string,
  state: 'alta' | 'baja',
  clientId: number,
  breedId: number,

  breedName?: string,
  speciesName?: string,
}

export interface ProfitMargin {
  id?: number,
  beginDate: string,
  mult: number,
}

export interface Species {
  id?: number,
  description: string,

  breedsCount?: number,
}

export interface SupplyPrice {
  id?: number,
  beginDate: string,
  currency: string,
  price: number,
  supplyTypeId: number,
}

export interface SupplyType {
  id?: number,
  description: string,

  currentPrice?: number,
  lotsCount?: number,
}

export interface User {
  id?: number,
  username: string,
  password: string,
  //createdAt, updatedAt not included
}

export interface Veterinary {
  id?: number,
  licenseNumber: string,
  docNum: string,
  docType: string,
  fullName: string,
  phone: string,
  address: string,
  email: string,
  state: 'alta' | 'baja',
}

export interface Visit {
  id?: number,
  diagnostic: string,
  dateTime: string,
  amount: number,
  petId: number,
  veterinaryId: number,
  cashFlowId: number,
  supplyTypeIds: number[],
}

export interface Withdrawal {
  id?: number,
  dateTime: string,
  description: string,
  amount: number,
  state: string,
  payDate: string,
  cashFlowId: number,
}