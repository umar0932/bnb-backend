import { Field, InputType } from '@nestjs/graphql'

import { IsOptional } from 'class-validator'

import { CustomerEventTicketsFilterInput } from './customer-event-tickets-filter.input'

@InputType()
export class ListCustomerEventTicketsInputs {
  @Field(() => CustomerEventTicketsFilterInput, { nullable: true })
  @IsOptional()
  filter?: CustomerEventTicketsFilterInput

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
