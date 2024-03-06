import { Field, Int, ObjectType } from '@nestjs/graphql'

import { SubCategory } from '@app/category/entities'

@ObjectType()
export class ListSubCategoriesResponse {
  @Field(() => [SubCategory])
  results: SubCategory[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
