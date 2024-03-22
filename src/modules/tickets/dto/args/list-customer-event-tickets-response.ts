import { Field, Int, ObjectType } from '@nestjs/graphql'

import { RelayTypes } from '@app/common'
import { CustomerEventTickets } from '@app/tickets/entities'

@ObjectType()
export class CustomerEventTicketsResponse extends RelayTypes<CustomerEventTickets>(
  CustomerEventTickets
) {}

@ObjectType()
export class ListCustomerEventTicketsResponse {
  @Field(() => [CustomerEventTickets])
  results: CustomerEventTickets[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
