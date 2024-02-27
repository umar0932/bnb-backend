import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SuccessResponse {
  @Field(() => Boolean, { nullable: true })
  success: boolean

  @Field(() => String, { nullable: true })
  message?: string
}
