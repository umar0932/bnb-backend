
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateUserInput {
    email: string;
    password: string;
    role?: Nullable<string>;
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
    email: string;
    id: number;
    password: string;
    role: string;
}

type Nullable<T> = T | null;
