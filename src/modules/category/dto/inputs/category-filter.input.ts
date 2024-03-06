import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CategoryFilterInputs {
  @Field(() => String, { nullable: true })
  search?: string
}
