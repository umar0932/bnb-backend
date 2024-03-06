import { Field, InputType } from '@nestjs/graphql'

import { IsOptional } from 'class-validator'

import { SubCategoryFilterInputs } from './sub-category-filter.input'

@InputType()
export class ListSubCategoriesInput {
  @Field(() => SubCategoryFilterInputs, { nullable: true })
  @IsOptional()
  filter?: SubCategoryFilterInputs

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
