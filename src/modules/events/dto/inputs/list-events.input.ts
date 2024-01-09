import { Field, InputType } from '@nestjs/graphql'

import { EventFilterInput } from './event-filter.input'

@InputType()
export class ListEventsInputs {
  @Field({ name: 'offset', nullable: true, defaultValue: 0 })
  offset: number

  @Field({ name: 'limit', nullable: false })
  limit: number

  @Field(() => EventFilterInput, { nullable: true })
  filter?: EventFilterInput
}
