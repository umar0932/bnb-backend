import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class OrderFilterInput {
  @Field(() => String, { nullable: true })
  search?: string
}
