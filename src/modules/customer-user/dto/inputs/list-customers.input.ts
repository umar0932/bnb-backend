import { Field, InputType } from '@nestjs/graphql'

import { CustomerFilterInput } from './customer-filter.input'

@InputType()
export class ListCustomersInputs {
  @Field({ name: 'offset', nullable: true, defaultValue: 0 })
  offset: number

  @Field({ name: 'limit', nullable: false })
  limit: number

  @Field(() => CustomerFilterInput, { nullable: true })
  filter?: CustomerFilterInput
}
