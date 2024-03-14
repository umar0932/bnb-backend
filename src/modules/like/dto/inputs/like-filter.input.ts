import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class LikeFilterInputs {
  @Field(() => String, { nullable: true })
  search?: string
}
