import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { Allow, CurrentUser, SuccessResponse } from '@app/common'

import { Admin } from './entities'
import { AdminEmailUpdateResponse, AdminLoginResponse } from './dto/args'
import { AdminService } from './admin.service'
import { CreateAdminUserInput, LoginAdminInput } from './dto/inputs'
import { GqlAuthGuard } from './guards'

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => AdminLoginResponse, { description: 'Admin Login' })
  @UseGuards(GqlAuthGuard)
  async loginAsAdmin(@Args('input') loginAdminInput: LoginAdminInput, @CurrentUser() user) {
    return this.adminService.login(loginAdminInput, user)
  }

  @Mutation(() => SuccessResponse, { description: 'Create new admin user' })
  async createAdminUser(
    @Args('input') createAdminUserData: CreateAdminUserInput,
    @CurrentUser() contextUser: any
  ): Promise<SuccessResponse> {
    return this.adminService.create(createAdminUserData, contextUser)
  }

  @Query(() => SuccessResponse, { description: 'check if email already exist' })
  async validEmailAdmin(@Args('input') emailId: string): Promise<SuccessResponse> {
    return await this.adminService.isEmailExist(emailId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will update Admin Password'
  })
  @Allow()
  async updateAdminPassword(
    @CurrentUser() user: any,
    @Args('password') password: string
  ): Promise<SuccessResponse> {
    return await this.adminService.updatePassword(password, user.userId)
  }

  @Mutation(() => AdminEmailUpdateResponse, {
    description: 'Update admin email'
  })
  @Allow()
  async updateAdminEmail(@CurrentUser() user: any, @Args('input') email: string) {
    return this.adminService.updateAdminEmail(user, email)
  }
}
