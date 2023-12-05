
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

export interface CreateCategoryInput {
    categoryName: string;
}

export interface CreateCustomerInput {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface CreateOrganizerInput {
    description?: Nullable<string>;
    name: string;
    organizationBio?: Nullable<string>;
    websiteLink?: Nullable<string>;
}

export interface LoginAdminInput {
    email: string;
    password: string;
}

export interface LoginCustomerInput {
    email: string;
    password: string;
}

export interface UpdateCategoryInput {
    categoryName: string;
    idCategory: string;
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

export interface UpdateOrganizerInput {
    description?: Nullable<string>;
    name: string;
    organizationBio?: Nullable<string>;
    websiteLink?: Nullable<string>;
}

export interface Admin {
    email: string;
    firstName: string;
    idAdminUser: string;
    isActive?: Nullable<boolean>;
    lastName: string;
    password: string;
}

export interface AdminEmailUpdateResponse {
    access_token: string;
    user: Admin;
}

export interface AdminLoginResponse {
    access_token: string;
    user: Admin;
}

export interface Category {
    categoryName: string;
    idCategory: string;
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

export interface CustomerEmailUpdateResponse {
    access_token: string;
    user: Customer;
}

export interface CustomerLoginResponse {
    access_token: string;
    user: Customer;
}

export interface IMutation {
    createAdminUser(input: CreateAdminUserInput): SuccessResponse | Promise<SuccessResponse>;
    createCategory(input: CreateCategoryInput): SuccessResponse | Promise<SuccessResponse>;
    createCustomer(input: CreateCustomerInput): CustomerLoginResponse | Promise<CustomerLoginResponse>;
    createOrganizer(input: CreateOrganizerInput): SuccessResponse | Promise<SuccessResponse>;
    loginAsAdmin(input: LoginAdminInput): AdminLoginResponse | Promise<AdminLoginResponse>;
    loginAsCustomer(input: LoginCustomerInput): CustomerLoginResponse | Promise<CustomerLoginResponse>;
    updateAdminEmail(input: string): AdminEmailUpdateResponse | Promise<AdminEmailUpdateResponse>;
    updateAdminPassword(password: string): SuccessResponse | Promise<SuccessResponse>;
    updateCategory(input: UpdateCategoryInput): Category | Promise<Category>;
    updateCustomer(input: UpdateCustomerInput): Customer | Promise<Customer>;
    updateCustomerEmail(input: string): CustomerEmailUpdateResponse | Promise<CustomerEmailUpdateResponse>;
    updateCustomerPassword(password: string): SuccessResponse | Promise<SuccessResponse>;
    updateOrganizer(input: UpdateOrganizerInput): Organizer | Promise<Organizer>;
}

export interface Organizer {
    description: string;
    idOrganizerUser: string;
    isActive?: Nullable<boolean>;
    name: string;
    organizationBio: string;
    websiteLink: string;
}

export interface IQuery {
    getAllCategories(): Category[] | Promise<Category[]>;
    getCustomers(): Customer[] | Promise<Customer[]>;
    index(): string | Promise<string>;
    validEmailAdmin(input: string): SuccessResponse | Promise<SuccessResponse>;
    validEmailCustomer(input: string): SuccessResponse | Promise<SuccessResponse>;
}

export interface SuccessResponse {
    message?: Nullable<string>;
    success?: Nullable<boolean>;
}

type Nullable<T> = T | null;
