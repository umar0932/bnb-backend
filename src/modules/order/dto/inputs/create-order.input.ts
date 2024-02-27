import { InputType, Field, Int } from '@nestjs/graphql'

import { IsNotEmpty, IsNumber, ValidateNested, ArrayMinSize } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  @IsNotEmpty({ message: 'Event ID cannot be empty' })
  eventId!: string

  @Field(() => Int)
  @IsNumber({}, { message: 'Total price must be a number' })
  totalPrice!: number

  @Field(() => [TicketTypeInput])
  @ArrayMinSize(1, { message: 'At least one ticket must be provided' })
  @ValidateNested({ each: true })
  @Type(() => TicketTypeInput)
  tickets!: TicketTypeInput[]
}

@InputType()
class TicketTypeInput {
  @Field(() => Int)
  @IsNotEmpty({ message: 'Ticket ID cannot be empty' })
  id!: number

  @Field(() => Int)
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity!: number

  @Field(() => Int)
  @IsNumber({}, { message: 'Ticket price must be a number' })
  ticketPrice!: number
}
