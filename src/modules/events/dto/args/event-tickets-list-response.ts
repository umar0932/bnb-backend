import { Field, Int, ObjectType } from '@nestjs/graphql'

import { RelayTypes } from '@app/common'
import { Tickets } from '@app/events/entities'

@ObjectType()
export class EventTicketsResponse extends RelayTypes<Tickets>(Tickets) {}

@ObjectType()
export class ListEventTicketsResponse {
  @Field(() => [Tickets])
  results: Tickets[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
