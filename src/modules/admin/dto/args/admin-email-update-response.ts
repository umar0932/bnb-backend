import { ObjectType, PickType } from '@nestjs/graphql'
import { AdminLoginResponse } from './admin-login-response'

@ObjectType()
export class AdminEmailUpdateResponse extends PickType(AdminLoginResponse, [
  'accessToken',
  'user'
]) {}
