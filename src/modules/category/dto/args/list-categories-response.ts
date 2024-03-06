import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Category } from '@app/category/entities'

@ObjectType()
export class ListCategoriesResponse {
  @Field(() => [Category])
  results: Category[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
