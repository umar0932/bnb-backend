import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class SubCategoryFilterInputs {
  @Field(() => String, { nullable: true })
  search?: string
}
