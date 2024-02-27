import { Field, ObjectType } from '@nestjs/graphql'

import { Customer } from '@app/customer-user/entities/customer.entity'

@ObjectType()
export class CustomerLoginOrRegisterResponse {
  @Field(() => String)
  accessToken: string

  @Field(() => Customer)
  user: Partial<Customer>
}
