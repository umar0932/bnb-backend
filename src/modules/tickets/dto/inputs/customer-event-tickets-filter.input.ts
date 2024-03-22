import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CustomerEventTicketsFilterInput {
  @Field(() => String, { nullable: true })
  search?: string
}
