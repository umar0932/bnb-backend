import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { CreateUserInput } from './dto/create-user.input'
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard'
import Role from '@app/enums/roles.enum'
import { Roles } from '@app/auth/decorators/roles.decorator'
import { RolesGuard } from '@app/auth/guards/roles.guard'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // Example of a query that requires a JWT token and a role of ADMIN
  @Query(() => [User], { name: 'users' })
  // Make sure to add RolesGuard to the @UseGuards() decorator
  @UseGuards(JwtAuthGuard, RolesGuard)
  // Create roles in enums/roles.enum.ts
  // Import the enum
  // Add the right roles to the @Roles() decorator
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('email') email: string): Promise<User> {
    return this.userService.findOne(email)
  }

  @Mutation(() => User)
  create(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput)
  }
}
