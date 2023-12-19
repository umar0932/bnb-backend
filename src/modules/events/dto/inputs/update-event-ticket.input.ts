import { InputType, Field, PickType, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber } from 'class-validator'

import { CreateEventTicketInput } from './create-event-ticket.input'

@InputType()
export class UpdateEventTicketInput extends PickType(CreateEventTicketInput, [
  'refIdEvent',
  'ticketName',
  'availableQuantity',
  'ticketPrice',
  'startDate',
  'endDate',
  'ticketDescription',
  'isVisible',
  'minQuantity',
  'maxQuantity'
]) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Event ticket cannot be empty' })
  @IsNumber({}, { message: 'Event ID must be a number' })
  idEventTicket!: number
}
