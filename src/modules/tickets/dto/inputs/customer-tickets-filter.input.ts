import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CustomerTicketsFilterInput {
  @Field(() => String, { nullable: true })
  search?: string
}
