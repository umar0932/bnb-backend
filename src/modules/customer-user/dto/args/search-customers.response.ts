import { Field, ObjectType } from '@nestjs/graphql'

import { Customer } from '@app/customer-user/entities'

@ObjectType()
export class SearchCustomersResponse {
  @Field(() => [Customer], { nullable: true })
  results?: Partial<Customer[]>

  @Field(() => Number, { nullable: true })
  totalCount?: number

  @Field(() => String, { nullable: true })
  message?: string
}
