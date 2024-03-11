import { InputType, Field, PickType, ID, Int } from '@nestjs/graphql'

import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator'

import { CreateEventTicketInput } from './create-event-ticket.input'

@InputType()
export class UpdateEventTicketInput extends PickType(CreateEventTicketInput, [
  'eventId',
  'description',
  'isVisible'
]) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Ticket id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Ticket UUID format' })
  id!: string

  // Non Complusory Variables

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Ticket title must be a string' })
  title?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Available quantity must be a number' })
  availableQuantity?: number

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Ticket price must be a number' })
  price?: number

  @Field(() => Date)
  @IsOptional()
  @IsDate({ message: 'Invalid end date format' })
  startDate?: Date

  @Field(() => Date)
  @IsOptional()
  @IsDate({ message: 'Invalid end date format' })
  endDate?: Date

  @Field(() => Int)
  @IsOptional()
  @IsNumber({}, { message: 'Minimum quantity must be a number' })
  @Min(1, { message: 'Minimum quantity must be at least 1' })
  minQuantity?: number

  @Field(() => Int)
  @IsOptional()
  @IsNumber({}, { message: 'Maximum quantity must be a number' })
  @Min(1, { message: 'Maximum quantity must be at least 1' })
  maxQuantity?: number
}
