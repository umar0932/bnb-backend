import { ObjectType, PickType } from '@nestjs/graphql'
import { CustomerLoginResponse } from './customer-login-response'

@ObjectType()
export class CustomerEmailUpdateResponse extends PickType(CustomerLoginResponse, [
  'access_token',
  'user'
]) {}
