import { Field, InputType } from '@nestjs/graphql'

import { IsOptional } from 'class-validator'

import { CategoryFilterInputs } from './category-filter.input'

@InputType()
export class ListCategoriesInput {
  @Field(() => CategoryFilterInputs, { nullable: true })
  @IsOptional()
  filter?: CategoryFilterInputs

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
