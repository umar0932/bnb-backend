import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Rating } from '@app/rating/entities'

@ObjectType()
export class ListRatingsResponse {
  @Field(() => [Rating])
  results: Rating[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
