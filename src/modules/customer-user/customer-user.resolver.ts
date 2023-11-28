import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { Allow, CurrentUser } from '@app/common/decorator'

import { CreateCustomerInput } from './dto/inputs/create-customer.input'
import { Customer } from './entities/customer.entity'
import { CustomerEmailUpdateResponse } from './dto/args/customer-email-update-response'
import { CustomerLoginResponse } from './dto/args/customer-login-response'
import { CustomerUserService } from './customer-user.service'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { LoginCustomerInput } from './dto/inputs/login-customer.input'
import { UpdateCustomerInput } from './dto/inputs/update-user.input'
import { SuccessResponse } from '@app/common/dto/success-response'

@Resolver(() => Customer)
export class CustomerUserResolver {
  constructor(private readonly customerUserService: CustomerUserService) {}

  @Mutation(() => CustomerLoginResponse, { description: 'Customer Login' })
  @UseGuards(GqlAuthGuard)
  async loginAsCustomer(
    @Args('input') loginCustomerInput: LoginCustomerInput,
    @CurrentUser() user: any
  ) {
    return await this.customerUserService.login(loginCustomerInput, user)
  }

  @Query(() => SuccessResponse, { description: 'check if email already exist' })
  async validEmail(@Args('input') emailId: string): Promise<SuccessResponse> {
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
  getCustomers(@CurrentUser() user: any): Promise<Customer[]> {
    return this.customerUserService.getAllCustomers(user.userId)
  }

  @Mutation(() => Customer, { description: 'This will update Customer' })
  @Allow()
  async updateCustomer(
    @Args('input') updateCustomerInput: UpdateCustomerInput,
    @CurrentUser() user: any
  ): Promise<Partial<Customer>> {
    return await this.customerUserService.updateCustomerData(updateCustomerInput, user.userId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will update Customer Password'
  })
  @Allow()
  async updateCustomerPassword(
    @CurrentUser() user: any,
    @Args('password') password: string
  ): Promise<SuccessResponse> {
    return await this.customerUserService.updatePassword(password, user.userId)
  }

  @Mutation(() => CustomerEmailUpdateResponse, {
    description: 'Update customer email'
  })
  @Allow()
  async updateCustomerEmail(@CurrentUser() user: any, @Args('input') email: string) {
    return this.customerUserService.updateCustomerEmail(user, email)
  }
}
