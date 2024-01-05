import { InputType, Field } from '@nestjs/graphql'

import { IsNotEmpty, IsString, MinLength, MaxLength, IsNumber, IsArray } from 'class-validator'

@InputType()
export class EventDetailsInput {
  @Field(() => Number)
  @IsNotEmpty({ message: 'Event ID cannot be empty' })
  @IsNumber({}, { message: 'Event ID must be a number' })
  refIdEvent!: number

  @Field(() => String, { nullable: true })
  @IsString({ message: 'EventSummary name must be a string' })
  @IsNotEmpty({ message: 'EventSummary name cannot be empty' })
  @MinLength(10, { message: 'EventSummary name must be at least 10 characters long' })
  @MaxLength(150, { message: 'EventSummary name cannot be longer than 150 characters' })
  eventSummary!: string

  @Field(() => [String])
  @IsArray({ message: 'Tags must be an array' })
  eventImages?: string[]

  @Field(() => String, { nullable: true })
  @IsString({ message: 'EventDescrition name must be a string' })
  @IsNotEmpty({ message: 'EventDescrition name cannot be empty' })
  @MinLength(10, { message: 'EventDescrition name must be at least 10 characters long' })
  @MaxLength(150, { message: 'EventDescrition name cannot be longer than 150 characters' })
  eventDescription!: string
}
