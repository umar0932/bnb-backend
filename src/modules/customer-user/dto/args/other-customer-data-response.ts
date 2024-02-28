import { Field, ObjectType } from '@nestjs/graphql'

import { Customer } from '@app/customer-user/entities'

@ObjectType()
export class OtherCustomerDataResponse {
  @Field(() => Boolean)
  isFollowing: boolean

  @Field(() => Customer)
  user: Partial<Customer>
}
