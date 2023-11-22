
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCustomerInput {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LoginCustomerInput {
    email: string;
    password: string;
}

export interface Customer {
    JobTitle?: Nullable<string>;
    cellPhone?: Nullable<string>;
    city?: Nullable<string>;
    companyName?: Nullable<string>;
    country?: Nullable<string>;
    email: string;
    firstAddress?: Nullable<string>;
    firstName: string;
    homePhone?: Nullable<string>;
    id: string;
    isActive?: Nullable<boolean>;
    lastName: string;
    password: string;
    secondAddress?: Nullable<string>;
    state?: Nullable<string>;
    website?: Nullable<string>;
    zipCode?: Nullable<string>;
}

export interface CustomerLoginResponse {
    access_token: string;
    user: Customer;
}

export interface IMutation {
    createCustomer(createCustomerInput: CreateCustomerInput): CustomerLoginResponse | Promise<CustomerLoginResponse>;
    loginAsCustomer(loginCustomerInput: LoginCustomerInput): CustomerLoginResponse | Promise<CustomerLoginResponse>;
}

export interface IQuery {
    customers(): Customer[] | Promise<Customer[]>;
    index(): string | Promise<string>;
}

type Nullable<T> = T | null;
