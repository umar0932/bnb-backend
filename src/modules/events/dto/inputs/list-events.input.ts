import { Field, InputType } from '@nestjs/graphql'

import { EventFilterInput } from './event-filter.input'
import { IsOptional } from 'class-validator'

@InputType()
export class ListEventsInputs {
  @Field(() => EventFilterInput, { nullable: true })
  @IsOptional()
  filter?: EventFilterInput

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
