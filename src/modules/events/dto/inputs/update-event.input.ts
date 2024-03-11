import { InputType, Field, PickType, ID } from '@nestjs/graphql'

import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { CreateLocationInput } from '@app/common'

import { CreateBasicEventInput } from './create-event.input'

@InputType()
export class UpdateBasicEventInput extends PickType(CreateBasicEventInput, [
  'categoryId',
  'subCategoryId',
  'tags',
  'type'
]) {
  // Complusory Variables
  @Field(() => ID)
  @IsNotEmpty({ message: 'Event ticket cannot be empty' })
  @IsString({ message: 'Event title must be a string' })
  @IsUUID('4', { message: 'Invalid Category UUID format' })
  id!: string

  // Non Complusory Variables

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Event title must be a string' })
  title?: string

  @Field(() => CreateLocationInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLocationInput)
  location?: CreateLocationInput

  @Field(() => Date, { nullable: true })
  @IsDate({ message: 'Invalid end date format' })
  @IsOptional()
  startDate?: Date

  @Field(() => Date, { nullable: true })
  @IsDate({ message: 'Invalid end date format' })
  @IsOptional()
  endDate?: Date
}
