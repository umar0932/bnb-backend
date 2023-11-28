import { Field, ObjectType } from '@nestjs/graphql'

import { Customer } from '@app/customer-user/entities/customer.entity'

@ObjectType()
export class CustomerLoginResponse {
  @Field()
  access_token: string

  @Field(() => Customer)
  user: Partial<Customer>
}
