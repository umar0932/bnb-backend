import { InputType, Field, PickType, ID } from '@nestjs/graphql'

import { IsNotEmpty, IsUUID } from 'class-validator'

import { CreateEventTicketInput } from './create-event-ticket.input'

@InputType()
export class UpdateEventTicketInput extends PickType(CreateEventTicketInput, [
  'eventId',
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
  @IsNotEmpty({ message: 'Ticket id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Ticket UUID format' })
  id!: string
}
