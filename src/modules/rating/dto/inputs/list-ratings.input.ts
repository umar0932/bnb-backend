import { Field, InputType } from '@nestjs/graphql'

import { IsOptional, IsUUID } from 'class-validator'

import { RatingFilterInputs } from './rating-filter.input'

@InputType()
export class ListRatingsInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid Event UUID format' })
  eventId?: string

  @Field(() => RatingFilterInputs, { nullable: true })
  @IsOptional()
  filter?: RatingFilterInputs

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
