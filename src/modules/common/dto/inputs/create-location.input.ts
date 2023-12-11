import { LocationTypes } from '@app/common/types'
import { Field, InputType } from '@nestjs/graphql'

import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator'

@InputType()
export class CreateLocationInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Venue name cannot be empty' })
  @IsString({ message: 'Venue name must be a string' })
  venueName!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Street address cannot be empty' })
  @IsString({ message: 'Street address must be a string' })
  streetAddress!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Country cannot be empty' })
  @IsString({ message: 'Country must be a string' })
  country!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'City cannot be empty' })
  @IsString({ message: 'City must be a string' })
  city!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'State must be a string' })
  state?: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Postal code cannot be empty' })
  @IsString()
  postalCode!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Latitude cannot be empty' })
  @IsString()
  lat!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Longitude cannot be empty' })
  @IsString()
  long!: string

  @Field(() => LocationTypes)
  @IsEnum(LocationTypes, { message: 'Invalid location type' })
  locationType!: LocationTypes

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Place ID must be a string' })
  placeId?: string
}
