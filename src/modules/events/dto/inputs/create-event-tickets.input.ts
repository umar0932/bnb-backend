import { InputType, Field } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsDate
} from 'class-validator'

@InputType()
export class CreateEventTicketsInput {
  @Field(() => Number)
  @IsNotEmpty({ message: 'Event ID cannot be empty' })
  @IsNumber({}, { message: 'Event ID must be a number' })
  refIdEvent!: number

  @Field(() => String)
  @IsString({ message: 'Ticket name must be a string' })
  @IsNotEmpty({ message: 'Ticket name cannot be empty' })
  @MinLength(1, { message: 'Ticket name must be at least 1 character long' })
  @MaxLength(50, { message: 'Ticket name cannot be longer than 50 characters' })
  ticketName!: string

  @Field(() => Number)
  @IsNotEmpty({ message: 'Available quantity cannot be empty' })
  @IsNumber({}, { message: 'Available quantity must be a number' })
  availableQuantity!: number

  @Field(() => Number)
  @IsNotEmpty({ message: 'Ticket price cannot be empty' })
  @IsNumber({}, { message: 'Ticket price must be a number' })
  ticketPrice!: number

  @Field(() => Date)
  @IsNotEmpty({ message: 'Start date cannot be empty' })
  @IsDate({ message: 'Invalid end date format' })
  startDate!: Date

  @Field(() => Date)
  @IsNotEmpty({ message: 'End date cannot be empty' })
  @IsDate({ message: 'Invalid end date format' })
  endDate!: Date

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Ticket description must be a string' })
  @MinLength(0, { message: 'Ticket description must be at least 0 characters long' })
  @MaxLength(50, { message: 'Ticket description cannot be longer than 50 characters' })
  ticketDescription?: string

  @Field(() => Boolean, { nullable: true })
  @IsBoolean({ message: 'Is visible must be a boolean' })
  isVisible?: boolean

  @Field(() => Number)
  @IsNotEmpty({ message: 'Minimum quantity cannot be empty' })
  @IsNumber({}, { message: 'Minimum quantity must be a number' })
  // @MinLength(1, { message: 'Minimum quantity must be at least 1' })
  minQuantity!: number

  @Field(() => Number)
  @IsNotEmpty({ message: 'Maximum quantity cannot be empty' })
  @IsNumber({}, { message: 'Maximum quantity must be a number' })
  // @MinLength(1, { message: 'Maximum quantity must be at least 1' })
  maxQuantity!: number
}
