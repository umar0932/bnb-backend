import { InputType, Field } from '@nestjs/graphql'

import { IsNotEmpty, IsString, MinLength, MaxLength, IsArray, IsUUID } from 'class-validator'

@InputType()
export class EventDetailsInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Event id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Event UUID format' })
  eventId!: string

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Summary name must be a string' })
  @IsNotEmpty({ message: 'Summary name cannot be empty' })
  @MinLength(10, { message: 'Summary name must be at least 10 characters long' })
  @MaxLength(150, { message: 'Summary name cannot be longer than 150 characters' })
  summary!: string

  @Field(() => [String])
  @IsArray({ message: 'Event Images must be an array' })
  eventImages?: string[]

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Descrition name must be a string' })
  @IsNotEmpty({ message: 'Descrition name cannot be empty' })
  @MinLength(10, { message: 'Descrition name must be at least 10 characters long' })
  @MaxLength(150, { message: 'Descrition name cannot be longer than 150 characters' })
  description!: string
}
