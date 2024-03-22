import { Field, Int, ObjectType } from '@nestjs/graphql'

import { RelayTypes } from '@app/common'
import { CustomerTickets } from '@app/tickets/entities'

@ObjectType()
export class CustomerTicketsResponse extends RelayTypes<CustomerTickets>(CustomerTickets) {}

@ObjectType()
export class ListCustomerTicketsResponse {
  @Field(() => [CustomerTickets])
  results: CustomerTickets[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
