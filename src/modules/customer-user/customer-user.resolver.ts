import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { Profile } from 'passport'

import { Allow, CurrentUser, JwtUserPayload, SocialProfile, SuccessResponse } from '@app/common'
import { S3SignedUrlResponse } from '@app/aws-s3-client/dto/args'

import {
  CreateCustomerInput,
  CreateOrganizerInput,
  ListCustomersInputs,
  LoginCustomerInput,
  RegisterOrLoginSocialInput,
  UpdateCustomerInput,
  UpdateOrganizerInput
} from './dto/inputs'
import { Customer, Organizer } from './entities'
import {
  CustomerEmailUpdateResponse,
  CustomerLoginOrRegisterResponse,
  ListCustomersResponse,
  OtherCustomerDataResponse,
  SearchCustomersResponse
} from './dto/args'
import { CustomerUserService } from './customer-user.service'
import { GqlAuthGuard, SocialAuthGuard } from './guards'

@Resolver(() => Customer)
export class CustomerUserResolver {
  constructor(private readonly customerUserService: CustomerUserService) {}

  // Queries

  @Query(() => ListCustomersResponse, {
    description: 'The List of Customers with Pagination and filters'
  })
  @Allow()
  async getCustomersAdmin(
    @Args('input') listCustomersInputs: ListCustomersInputs
  ): Promise<ListCustomersResponse> {
    const { limit, offset, filter } = listCustomersInputs
    const [customers, count] = await this.customerUserService.findAllCustomersWithPagination({
      limit,
      offset,
      filter
    })
    return { results: customers, totalRows: count, limit, offset }
  }

  @Query(() => Customer, { description: 'Get the Customer' })
  @Allow()
  async getCustomerData(@CurrentUser() user: JwtUserPayload): Promise<Customer> {
    return await this.customerUserService.getCustomerById(user.userId)
  }

  @Query(() => S3SignedUrlResponse, {
    description: 'Get S3 bucket Signed Url'
  })
  @Allow()
  async getCustomerUploadUrl(): Promise<S3SignedUrlResponse> {
    return this.customerUserService.getCustomerUploadUrl()
  }

  @Query(() => [Customer], {
    description: 'Get the followers of the authenticated customer'
  })
  @Allow()
  async getFollowers(@Args('customerId') customerId: string): Promise<Customer[]> {
    return this.customerUserService.getFollowers(customerId)
  }

  @Query(() => [Customer], {
    description: 'Get the following of the authenticated customer'
  })
  @Allow()
  async getFollowing(@Args('customerId') customerId: string): Promise<Customer[]> {
    return this.customerUserService.getFollowing(customerId)
  }

  @Query(() => OtherCustomerDataResponse, { description: 'Get other Customer Data' })
  @Allow()
  async getOtherCustomerData(
    @CurrentUser() user: JwtUserPayload,
    @Args('customerId') customerId: string
  ): Promise<OtherCustomerDataResponse> {
    const otherCustomer = await this.customerUserService.getCustomerById(customerId)
    const isFollowing = await this.customerUserService.isFollowing(user.userId, customerId)
    return { user: otherCustomer, isFollowing }
  }

  @Query(() => SearchCustomersResponse, {
    description: 'The List of Customers with filters'
  })
  @Allow()
  async searchCustomers(@Args('search') search: string): Promise<SearchCustomersResponse> {
    if (search.length > 0) {
      const [customers, count] = await this.customerUserService.searchCustomers(search)

      return { results: customers, totalCount: count }
    }
    return { message: 'search should be greater then 2' }
  }

  // Mutations

  @Mutation(() => CustomerLoginOrRegisterResponse, { description: 'Customer Login' })
  @UseGuards(GqlAuthGuard)
  async loginAsCustomer(
    @Args('input') loginCustomerInput: LoginCustomerInput,
    @CurrentUser() user: any
  ) {
    return await this.customerUserService.loginCustomer(loginCustomerInput, user)
  }

  @Mutation(() => CustomerLoginOrRegisterResponse, { description: 'Customer Social Registration' })
  @UseGuards(SocialAuthGuard)
  async continueWithSocialSite(
    @SocialProfile() profile: Profile,
    @Args('input') input: RegisterOrLoginSocialInput
  ): Promise<CustomerLoginOrRegisterResponse> {
    return await this.customerUserService.continueWithSocialSite(profile, input.provider)
  }

  @Mutation(() => CustomerLoginOrRegisterResponse, {
    description: 'This will signup new Customers'
  })
  async createCustomer(
    @Args('input') createCustomerData: CreateCustomerInput
  ): Promise<CustomerLoginOrRegisterResponse> {
    return await this.customerUserService.createCustomer(createCustomerData)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will signup new Organizers'
  })
  @Allow()
  async createOrganizer(
    @CurrentUser() user: JwtUserPayload,
    @Args('input') createOrganizerInput: CreateOrganizerInput
  ): Promise<SuccessResponse> {
    return await this.customerUserService.createOrganizer(createOrganizerInput, user.userId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will follow a customer'
  })
  @Allow()
  async followCustomer(
    @Args('customerId') customerId: string,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return this.customerUserService.followCustomer(user.userId, customerId)
  }

  @Mutation(() => String, {
    description: 'This will save/update user profile image in DB'
  })
  @Allow()
  async saveCustomerMediaUrl(
    @Args('fileName') fileName: string,
    @CurrentUser() user: JwtUserPayload
  ): Promise<any> {
    return this.customerUserService.saveMediaUrl(user.userId, fileName)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will unfollow a customer'
  })
  @Allow()
  async unfollowCustomer(
    @Args('customerId') customerId: string,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return this.customerUserService.unfollowCustomer(user.userId, customerId)
  }

  @Mutation(() => Customer, { description: 'This will update Customer' })
  @Allow()
  async updateCustomer(
    @Args('input') updateCustomerInput: UpdateCustomerInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Partial<Customer>> {
    return await this.customerUserService.updateCustomerData(updateCustomerInput, user.userId)
  }

  @Mutation(() => CustomerEmailUpdateResponse, {
    description: 'Update customer email'
  })
  @Allow()
  async updateCustomerEmail(@CurrentUser() user: JwtUserPayload, @Args('input') email: string) {
    return this.customerUserService.updateCustomerEmail(user.userId, email)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will update Customer Password'
  })
  @Allow()
  async updateCustomerPassword(
    @CurrentUser() user: JwtUserPayload,
    @Args('password') password: string
  ): Promise<SuccessResponse> {
    return await this.customerUserService.updatePassword(password, user.userId)
  }

  @Mutation(() => Organizer, {
    description: 'This will signup update Organizers'
  })
  @Allow()
  async updateOrganizer(
    @CurrentUser() user: JwtUserPayload,
    @Args('input') updateOrganizerInput: UpdateOrganizerInput
  ): Promise<Partial<Organizer>> {
    return await this.customerUserService.updateOrganizerData(updateOrganizerInput, user.userId)
  }
}
