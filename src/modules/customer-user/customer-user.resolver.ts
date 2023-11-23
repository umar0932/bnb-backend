import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { Customer } from './entities/customer.entity'
import { CustomerLoginResponse } from './dto/args/customer-login-response'
import { CustomerUserService } from './customer-user.service'
import { CreateCustomerInput } from './dto/inputs/create-customer.input'
import { Allow, CurrentUser } from 'src/common/decorator'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { LoginCustomerInput } from './dto/inputs/login-customer.input'

@Resolver(() => Customer)
export class CustomerUserResolver {
  constructor(private readonly customerUserService: CustomerUserService) {}

  @Mutation(() => CustomerLoginResponse, { description: 'Customer Login' })
  @UseGuards(GqlAuthGuard)
  async loginAsCustomer(
    @Args('loginCustomerInput') loginCustomerInput: LoginCustomerInput,
    @CurrentUser() user
  ) {
    return await this.customerUserService.login(loginCustomerInput, user)
  }

  @Mutation(() => CustomerLoginResponse, {
    description: 'This will signup new `Customers'
  })
  async createCustomer(
    @Args('createCustomerInput') createCustomerData: CreateCustomerInput
  ): Promise<CustomerLoginResponse> {
    return await this.customerUserService.create(createCustomerData)
  }

  // Example of a query that requires a JWT token and a role of ADMIN
  @Query(() => [Customer], { description: 'The List of Customers' })
  // Make sure to add RolesGuard to the @UseGuards() decorator
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // Create roles in enums/roles.enum.ts
  // Import the enum
  // Add the right roles to the @Roles() decorator
  // @Roles(Role.ORGANIZER)
  @Allow()
  getCustomers(@CurrentUser() user): Promise<Customer[]> {
    console.log('User22------>>>>>>>>', user)

    return this.customerUserService.findAll(user.id)
  }

  // @Query(() => Customer, { name: 'customer' })
  // findOne(@Args('email') email: string): Promise<Customer> {
  //   return this.customerUserService.findOne(email)
  // }

  // @Mutation(() => Customer)
  // create(@Args('createUserInput') createUserInput: CreateUserInput): Promise<Customer> {
  //   return this.customerUserService.create(createUserInput)
  // }
}
