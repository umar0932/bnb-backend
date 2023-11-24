import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { CurrentUser } from '@app/common'
import { SuccessResponse } from '@app/common/dto/success-response'

import { AdminService } from './admin.service'
import { AdminLoginResponse } from './dto/args/admin-login-response'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { Admin } from './entities/admin.entity'
import { LoginAdminInput } from './dto/inputs/login-admin.input'
import { CreateAdminUserInput } from './dto/inputs/create-admin-user.input'

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => AdminLoginResponse, { description: 'Admin Login' })
  @UseGuards(GqlAuthGuard)
  async loginAsAdmin(
    @Args('loginAdminInput') loginAdminInput: LoginAdminInput,
    @CurrentUser() user
  ) {
    return this.adminService.login(loginAdminInput, user)
  }

  @Mutation(() => SuccessResponse, { description: 'Create new admin user' })
  // @Allow([JWT_STRATEGY_NAME.ADMIN], {
  //   [SUBJECT.USER_MANAGEMENT]: [ACTION.CREATE],
  // })
  async createAdminUser(
    @Args('createAdminInput') createAdminUserData: CreateAdminUserInput,
    @CurrentUser() contextUser
  ): Promise<SuccessResponse> {
    return this.adminService.create(createAdminUserData, contextUser)
  }
}
