import { Field, InputType } from '@nestjs/graphql'

import { IsOptional, IsUUID } from 'class-validator'

import { LikeFilterInputs } from './like-filter.input'

@InputType()
export class ListLikesInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid Event UUID format' })
  eventId?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid Customer UUID format' })
  customerId?: string

  @Field(() => LikeFilterInputs, { nullable: true })
  @IsOptional()
  filter?: LikeFilterInputs

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
