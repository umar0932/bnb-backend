import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export default class PageData {
  @Field(() => Int)
  public count: number

  @Field(() => Int, { nullable: true })
  public limit?: number = 100

  @Field(() => Int, { nullable: true })
  public offset?: number = 0
}
