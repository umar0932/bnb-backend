import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Likes } from '@app/like/entities'

@ObjectType()
export class ListLikesResponse {
  @Field(() => [Likes])
  results: Likes[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
