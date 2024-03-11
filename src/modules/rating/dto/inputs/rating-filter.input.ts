import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class RatingFilterInputs {
  @Field(() => String, { nullable: true })
  search?: string
}
