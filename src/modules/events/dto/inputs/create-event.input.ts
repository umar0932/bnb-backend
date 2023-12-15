import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsDate } from 'class-validator'
import { Type } from 'class-transformer'

import { CreateLocationInput } from '@app/common'

@InputType()
export class CreateBasicEventInput {
  @Field()
  @IsNotEmpty({ message: 'Event title cannot be empty' })
  @IsString({ message: 'Event title must be a string' })
  eventTitle!: string

  @Field(() => Number, { nullable: true })
  @IsNumber({}, { message: 'RefIdCategory must be a number' })
  refIdCategory?: number

  @Field(() => Number, { nullable: true })
  @IsNumber({}, { message: 'RefIdSubCategory must be a number' })
  refIdSubCategory?: number

  @Field(() => [String], { nullable: true })
  @IsArray({ message: 'Tags must be an array' })
  tags?: string[]

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Type must be a string' })
  type?: string

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
}
