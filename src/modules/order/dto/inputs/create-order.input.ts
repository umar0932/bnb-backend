import { InputType, Field, Int } from '@nestjs/graphql'

import { IsNotEmpty, IsNumber, ValidateNested, ArrayMinSize, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Event id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Event UUID format' })
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
  @Field(() => String)
  @IsNotEmpty({ message: 'Ticket ID cannot be empty' })
  @IsUUID('4', { message: 'Invalid Ticket UUID format' })
  id!: string

  @Field(() => Int)
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity!: number

  @Field(() => Number)
  @IsNumber({}, { message: 'Ticket price must be a number' })
  price!: number
}
