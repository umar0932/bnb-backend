
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateAdminUserInput {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface CreateCustomerInput {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LoginAdminInput {
    email: string;
    password: string;
}

export interface LoginCustomerInput {
    email: string;
    password: string;
}

export interface UpdateCustomerInput {
    JobTitle?: Nullable<string>;
    cellPhone?: Nullable<string>;
    city?: Nullable<string>;
    companyName?: Nullable<string>;
    country?: Nullable<string>;
    firstAddress?: Nullable<string>;
    firstName?: Nullable<string>;
    homePhone?: Nullable<string>;
    isActive?: Nullable<boolean>;
    lastName?: Nullable<string>;
    secondAddress?: Nullable<string>;
    state?: Nullable<string>;
    website?: Nullable<string>;
    zipCode?: Nullable<string>;
}

export interface Admin {
    email: string;
    firstName: string;
    idAdminUser: string;
    isActive?: Nullable<boolean>;
    lastName: string;
    password: string;
}

export interface AdminLoginResponse {
    access_token: string;
    user: Admin;
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
    createAdminUser(input: CreateAdminUserInput): SuccessResponse | Promise<SuccessResponse>;
    createCustomer(input: CreateCustomerInput): CustomerLoginResponse | Promise<CustomerLoginResponse>;
    loginAsAdmin(input: LoginAdminInput): AdminLoginResponse | Promise<AdminLoginResponse>;
    loginAsCustomer(input: LoginCustomerInput): CustomerLoginResponse | Promise<CustomerLoginResponse>;
    updateAdminPassword(password: string): SuccessResponse | Promise<SuccessResponse>;
    updateCustomer(input: UpdateCustomerInput): Customer | Promise<Customer>;
    updateCustomerPassword(password: string): SuccessResponse | Promise<SuccessResponse>;
}

export interface IQuery {
    getCustomers(): Customer[] | Promise<Customer[]>;
    index(): string | Promise<string>;
}

export interface SuccessResponse {
    message?: Nullable<string>;
    success?: Nullable<boolean>;
}

type Nullable<T> = T | null;
