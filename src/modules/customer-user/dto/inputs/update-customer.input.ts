import { InputType, Field } from '@nestjs/graphql'

import { IsUrl, IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator'

@InputType()
export class UpdateCustomerInput {
  @IsString({ message: 'First name should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  firstName?: string

  @IsString({ message: 'Last name should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  lastName?: string

  @IsOptional()
  @Field(() => String, { nullable: true })
  homePhone?: string

  @IsOptional()
  @Field(() => String, { nullable: true })
  cellPhone?: string

  @IsString({ message: 'MediaUrl should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  @MaxLength(250, { message: 'MediaUrl should not exceed 50 characters' })
  profileImage?: string

  @IsString({ message: 'Job title should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  jobTitle?: string

  @IsString({ message: 'Company name should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  companyName?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format' })
  @MaxLength(150, { message: 'Website link should not exceed 150 characters' })
  website?: string

  @IsString({ message: 'First address should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  firstAddress?: string

  @IsString({ message: 'Second address should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  secondAddress?: string

  @IsString({ message: 'City should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  city?: string

  @IsString({ message: 'Country should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  country?: string

  @IsString({ message: 'Zip code should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  zipCode?: string

  @IsString({ message: 'State should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  state?: string

  @IsString({ message: 'Stripe Customer ID should be a string' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  stripeCustomerId?: string

  @IsBoolean({ message: 'isActive should be a boolean value' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  isActive?: boolean
}
