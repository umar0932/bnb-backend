import { Field, InputType } from '@nestjs/graphql'

import { IsOptional } from 'class-validator'

import { EventTicketsFilterInput } from './event-tickets-filter.input'

@InputType()
export class ListEventTicketsInputs {
  @Field(() => EventTicketsFilterInput, { nullable: true })
  @IsOptional()
  filter?: EventTicketsFilterInput

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
