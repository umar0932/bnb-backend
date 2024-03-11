import { Field, InputType } from '@nestjs/graphql'

import { IsOptional } from 'class-validator'

import { OrderFilterInput } from './order-filter.input'

@InputType()
export class ListOrdersInputs {
  @Field(() => OrderFilterInput, { nullable: true })
  @IsOptional()
  filter?: OrderFilterInput

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
