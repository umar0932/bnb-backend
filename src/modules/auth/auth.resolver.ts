import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { AuthService } from './auth.service'
import { CreateUserInput } from '@app/users/dto/create-user.input'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { SignResponse } from './dto/args/sign-response'
import { LoginUserInput } from './dto/inputs/login-user.input'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignResponse)
  @UseGuards(GqlAuthGuard)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() contextUser) {
    return this.authService.login(loginUserInput, contextUser.user)
  }

  @Mutation(() => SignResponse)
  signup(@Args('signupUserInput') signupUserInput: CreateUserInput) {
    return this.authService.signup(signupUserInput)
  }
}
