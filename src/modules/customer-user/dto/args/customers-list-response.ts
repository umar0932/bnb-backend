import { Field, ObjectType } from '@nestjs/graphql'

import { Customer } from '@app/customer-user/entities'
import { RelayTypes } from '@app/common'

@ObjectType()
export class CustomersResponse extends RelayTypes<Customer>(Customer) {}

@ObjectType()
export class ListCustomersResponse {
  @Field(() => [Customer])
  results: Customer[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field({ nullable: true, defaultValue: 0 })
  offset?: number

  @Field({ nullable: true })
  limit?: number
}
