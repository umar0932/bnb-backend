import { InputType, Field, ID, Int } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsDate,
  Min,
  IsUUID
} from 'class-validator'

@InputType()
export class CreateEventTicketInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Event id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Event UUID format' })
  eventId!: string

  @Field(() => String)
  @IsString({ message: 'Ticket title must be a string' })
  @IsNotEmpty({ message: 'Ticket title cannot be empty' })
  @MinLength(1, { message: 'Ticket title must be at least 1 character long' })
  @MaxLength(50, { message: 'Ticket title cannot be longer than 50 characters' })
  title!: string

  @Field(() => Int)
  @IsNotEmpty({ message: 'Available quantity cannot be empty' })
  @IsNumber({}, { message: 'Available quantity must be a number' })
  availableQuantity!: number

  @Field(() => Int)
  @IsNotEmpty({ message: 'Ticket price cannot be empty' })
  @IsNumber({}, { message: 'Ticket price must be a number' })
  price!: number

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
  description?: string

  @Field(() => Boolean, { nullable: true })
  @IsBoolean({ message: 'Is visible must be a boolean' })
  isVisible?: boolean

  @Field(() => Int)
  @IsNotEmpty({ message: 'Minimum quantity cannot be empty' })
  @IsNumber({}, { message: 'Minimum quantity must be a number' })
  @Min(1, { message: 'Minimum quantity must be at least 1' })
  minQuantity!: number

  @Field(() => Int)
  @IsNotEmpty({ message: 'Maximum quantity cannot be empty' })
  @IsNumber({}, { message: 'Maximum quantity must be a number' })
  @Min(1, { message: 'Maximum quantity must be at least 1' })
  maxQuantity!: number
}
