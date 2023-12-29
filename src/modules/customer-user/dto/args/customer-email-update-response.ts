import { ObjectType, PickType } from '@nestjs/graphql'

import { CustomerLoginOrRegisterResponse } from './customer-login-or-register-response'

@ObjectType()
export class CustomerEmailUpdateResponse extends PickType(CustomerLoginOrRegisterResponse, [
  'accessToken',
  'user'
]) {}
