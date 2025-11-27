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

}

export interface CashFlow {
  
}

export interface Client {
  
}

export interface Installment {
  
}

export interface Lot {
  
}

export interface Pet {
  
}

export interface ProfitMargin {
  
}

export interface Species {
  
}

export interface SupplyPrice {
  
}

export interface SupplyType {
  
}

export interface User {
  
}

export interface Veterinary {
  
}

export interface Visit {
  
}

export interface Withdrawal {
  
}