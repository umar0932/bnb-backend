import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { Allow, CurrentUser, JwtUserPayload, SuccessResponse } from '@app/common'

import { Admin } from './entities'
import { AdminEmailUpdateResponse, AdminLoginResponse } from './dto/args'
import { AdminService } from './admin.service'
import { CreateAdminUserInput, LoginAdminInput, UpdateAdminUserInput } from './dto/inputs'
import { GqlAuthGuard } from './guards'

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  // Queries

  @Query(() => SuccessResponse, { description: 'check if email already exist' })
  async validEmailAdmin(@Args('input') emailId: string): Promise<SuccessResponse> {
    return await this.adminService.isEmailExist(emailId)
  }

  // Mutations

  @Mutation(() => AdminLoginResponse, { description: 'Admin Login' })
  @UseGuards(GqlAuthGuard)
  async loginAsAdmin(@Args('input') loginAdminInput: LoginAdminInput, @CurrentUser() user: any) {
    return this.adminService.loginAdmin(loginAdminInput, user)
  }

  @Mutation(() => SuccessResponse, { description: 'Create new admin user' })
  // @Allow()
  async createAdminUser(
    @Args('input') createAdminUserData: CreateAdminUserInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return this.adminService.createAdmin(createAdminUserData, user?.userId)
  }

  @Mutation(() => String, {
    description: 'Update admin data'
  })
  @Allow()
  async updateAdminData(
    @Args('input') updateAdminUserData: UpdateAdminUserInput,
    @CurrentUser() user: JwtUserPayload
  ) {
    return this.adminService.updateAdminData(updateAdminUserData, user.userId)
  }

  @Mutation(() => AdminEmailUpdateResponse, {
    description: 'Update admin email'
  })
  @Allow()
  async updateAdminEmail(@CurrentUser() user: JwtUserPayload, @Args('input') email: string) {
    return this.adminService.updateAdminEmail(user.userId, email)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will update Admin Password'
  })
  @Allow()
  async updateAdminPassword(
    @CurrentUser() user: JwtUserPayload,
    @Args('password') password: string
  ): Promise<SuccessResponse> {
    return await this.adminService.updatePassword(password, user.userId)
  }
}
