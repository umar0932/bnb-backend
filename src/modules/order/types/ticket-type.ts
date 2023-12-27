import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TicketType {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  quantity: number

  @Field(() => Int)
  ticketPrice: number
}
