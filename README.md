# BNB PROJECT

**GraphQL** API with **user authentication** and **role based access control**.  
Technologies used are:

- GraphQL
- TypeORM
- Postgres
- Apollo Server
- Passport-JWT

## Setup

Start by cloning the repository into your local workstation:

```sh
git clone https://github.com/{username}/bnb-backend.git
```

This project is made with npm. 
Run `npm install`

```sh
cd ./my-project
npm install
```

Create thre `.env` files in the root of the project:

- `.env`
- `.env.dev`
- `.env.pro`

In the `.env.dev` file, put the environment variables used in **development**.  
The `.env.pro` file will contain all the environment variables for **production**.
The `.env` file will contain all the environment variables for **Docker**.

To make connection with the database install docker on your machine and then run the following commands

```sh
docker compose up 
```

To remove the Docker run

```sh
docker compose down 
```



## Usage

When the database is connected, you can start up the server by running `npm run start:dev`.
A GraphQL schema will be generated. This will contain a Users table and all the dto's for user authentication. If it is already present then the schema willupdate according to your typeORM Entity

To register a user:

- Go to the [GraphQL Playground](http://localhost:{APP_PORT}/graphql)
- Run the signup mutation using `email`, `password` and `username` variables

Running this mutation will create a new entry in the Users table **if the email is not already registered**.  


To login a user:

- Go to the [GraphQL Playground](http://localhost:{APP_PORT}/graphql)
- Run the login mutation using `email` and `password` variables

Running this mutation will check the credentials of the user, if the credentials are correct, the mutation will return a JWT.
This token contains the user information, including the user role.

## Jwt Guards

To protect an API route, you can use a **JwtGuard**. This guard checks if the user has a valid JWT. You can apply this guard to the **UseGuard decorator** to queries and mutations inside a resolver.
In this example the findAll users query inside the `users.resolver.ts` file is protected using this guard.

```js
  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
```

To send an authenticated request in the GraphQL playground, you can use the JWT that was returned after loggin in.
Add this to the HTTP Headers.  
**Remove the "<>"**.

```json
{
  "Authorization": "Bearer <your token>"
}
```

## Role Guards

The protect an API route from a specific user Role, you can use a **Roles** guard. This guard checks if the user has the correct roles to access the specified route.
In this example the findAll users query inside the `users.resolver.ts` file is protected using this guard.  
Only a user with the ADMIN role can access this endpoint.

```js
  @Query(() => [User], { name: 'users' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
```