import { InputType, Field } from '@nestjs/graphql'

import { IsNotEmpty, IsUUID, IsNumber, Min, Max } from 'class-validator'

@InputType()
export class CreateRatingInput {
  // Complusory Variables
  @Field(() => Number)
  @IsNotEmpty({ message: 'Organizer Rating cannot be empty' })
  @IsNumber({}, { message: 'Organizer Rating must be a number' })
  @Min(1, { message: 'Organizer Rating must be at least 1' })
  @Max(5, { message: 'Max Organizer Rating should be 5' })
  organizerRating!: number

  // Relations

  @Field(() => String)
  @IsNotEmpty({ message: 'Customer id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Customer UUID format' })
  customerId!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Event id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Event UUID format' })
  eventId!: string

  // Non Complusory Variables
}
