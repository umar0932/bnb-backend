import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Event } from '@app/events/entities'
import { RelayTypes } from '@app/common'

@ObjectType()
export class EventsResponse extends RelayTypes<Event>(Event) {}

@ObjectType()
export class ListEventsResponse {
  @Field(() => [Event])
  results: Event[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
