import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { Allow, CurrentUser, JwtUserPayload, SuccessResponse } from '@app/common'

import { CreateCustomerInput, LoginCustomerInput, UpdateCustomerInput } from './dto/inputs'
import { Customer } from './entities/customer.entity'
import { CustomerEmailUpdateResponse, CustomerLoginResponse } from './dto/args'
import { CustomerUserService } from './customer-user.service'
import { GqlAuthGuard } from './guards'
import { CreateOrganizerInput } from './dto/inputs/create-organizer.input'
import { Organizer } from './entities/organizer.entity'
import { UpdateOrganizerInput } from './dto/inputs/update-organizer.input'

@Resolver(() => Customer)
export class CustomerUserResolver {
  constructor(private readonly customerUserService: CustomerUserService) {}

  @Mutation(() => CustomerLoginResponse, { description: 'Customer Login' })
  @UseGuards(GqlAuthGuard)
  async loginAsCustomer(
    @Args('input') loginCustomerInput: LoginCustomerInput,
    @CurrentUser() user: JwtUserPayload
  ) {
    return await this.customerUserService.login(loginCustomerInput, user)
  }

  @Query(() => SuccessResponse, { description: 'check if email already exist' })
  async validEmailCustomer(@Args('input') emailId: string): Promise<SuccessResponse> {
    return await this.customerUserService.isEmailExist(emailId)
  }

  @Mutation(() => CustomerLoginResponse, {
    description: 'This will signup new `Customers'
  })
  async createCustomer(
    @Args('input') createCustomerData: CreateCustomerInput
  ): Promise<CustomerLoginResponse> {
    return await this.customerUserService.create(createCustomerData)
  }

  @Query(() => [Customer], { description: 'The List of Customers' })
  @Allow()
  getCustomers(@CurrentUser() user: JwtUserPayload): Promise<Customer[]> {
    return this.customerUserService.getAllCustomers(user.userId)
  }

  @Mutation(() => Customer, { description: 'This will update Customer' })
  @Allow()
  async updateCustomer(
    @Args('input') updateCustomerInput: UpdateCustomerInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Partial<Customer>> {
    return await this.customerUserService.updateCustomerData(updateCustomerInput, user.userId)
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

  @Mutation(() => CustomerEmailUpdateResponse, {
    description: 'Update customer email'
  })
  @Allow()
  async updateCustomerEmail(@CurrentUser() user: JwtUserPayload, @Args('input') email: string) {
    return this.customerUserService.updateCustomerEmail(user.userId, email)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will signup new `Organizers'
  })
  @Allow()
  async createOrganizer(
    @CurrentUser() user: JwtUserPayload,
    @Args('input') createOrganizerInput: CreateOrganizerInput
  ): Promise<SuccessResponse> {
    return await this.customerUserService.createOrganizer(createOrganizerInput, user.userId)
  }

  @Mutation(() => Organizer, {
    description: 'This will signup new `Organizers'
  })
  @Allow()
  async updateOrganizer(
    @CurrentUser() user: JwtUserPayload,
    @Args('input') updateOrganizerInput: UpdateOrganizerInput
  ): Promise<Partial<Organizer>> {
    return await this.customerUserService.updateOrganizerData(updateOrganizerInput, user.userId)
  }
}
