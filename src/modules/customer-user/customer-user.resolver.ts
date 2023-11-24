import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { Allow, CurrentUser } from '@app/common/decorator'

import { Customer } from './entities/customer.entity'
import { CustomerLoginResponse } from './dto/args/customer-login-response'
import { CustomerUserService } from './customer-user.service'
import { CreateCustomerInput } from './dto/inputs/create-customer.input'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { LoginCustomerInput } from './dto/inputs/login-customer.input'
import { UpdateCustomerInput } from './dto/inputs/update-user.input'

@Resolver(() => Customer)
export class CustomerUserResolver {
  constructor(private readonly customerUserService: CustomerUserService) {}

  @Mutation(() => CustomerLoginResponse, { description: 'Customer Login' })
  @UseGuards(GqlAuthGuard)
  async loginAsCustomer(
    @Args('input') loginCustomerInput: LoginCustomerInput,
    @CurrentUser() user
  ) {
    return await this.customerUserService.login(loginCustomerInput, user)
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
  getCustomers(@CurrentUser() user): Promise<Customer[]> {
    return this.customerUserService.getAllCustomers(user.userId)
  }

  @Mutation(() => Customer, { description: 'This will update Customer' })
  @Allow()
  async updateCustomer(
    @Args('input') updateCustomerInput: UpdateCustomerInput,
    @CurrentUser() user
  ): Promise<Customer> {
    return await this.customerUserService.updateCustomerData(updateCustomerInput, user.userId)
  }
}
