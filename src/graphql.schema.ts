
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateUserInput {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LoginUserInput {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface IMutation {
    create(createUserInput: CreateUserInput): User | Promise<User>;
    login(loginUserInput: LoginUserInput): LoginResponse | Promise<LoginResponse>;
    signup(signupUserInput: CreateUserInput): User | Promise<User>;
}

export interface IQuery {
    index(): string | Promise<string>;
    user(email: string): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface User {
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

type Nullable<T> = T | null;
