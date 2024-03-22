import { Field, InputType } from '@nestjs/graphql'

import { IsOptional, IsUUID } from 'class-validator'

import { CustomerTicketsFilterInput } from './customer-tickets-filter.input'

@InputType()
export class ListCustomerTicketsInputs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid Event UUID format' })
  eventId?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid Customer UUID format' })
  customerId?: string

  @Field(() => CustomerTicketsFilterInput, { nullable: true })
  @IsOptional()
  filter?: CustomerTicketsFilterInput

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
