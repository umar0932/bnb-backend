import { InputType, Field, ID } from '@nestjs/graphql'

import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsDate,
  IsUUID,
  IsOptional
} from 'class-validator'
import { Type } from 'class-transformer'

import { CreateLocationInput } from '@app/common'
import { EventLocationType } from '@app/events/event.constants'

@InputType()
export class CreateBasicEventInput {
  // Complusory Variables
  @Field(() => String)
  @IsNotEmpty({ message: 'Event title cannot be empty' })
  @IsString({ message: 'Event title must be a string' })
  title!: string

  @Field(() => CreateLocationInput)
  @ValidateNested()
  @Type(() => CreateLocationInput)
  location!: CreateLocationInput

  @Field(() => Date)
  @IsNotEmpty({ message: 'Start date cannot be empty' })
  @IsDate({ message: 'Invalid end date format' })
  startDate!: Date

  @Field(() => Date)
  @IsNotEmpty({ message: 'End date cannot be empty' })
  @IsDate({ message: 'Invalid end date format' })
  endDate!: Date

  // Relations

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid Category UUID format' })
  categoryId?: string

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid subCategory UUID format' })
  subCategoryId?: string

  // Non Complusory Variables

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  tags?: string[]

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Type must be a string' })
  @IsOptional()
  type?: string

  @Field(() => String, { nullable: true })
  @IsString({ message: 'MeetingUrl must be a string' })
  @IsOptional()
  meetingUrl?: string

  @Field(() => EventLocationType, { nullable: true })
  eventLocationType?: EventLocationType
}
