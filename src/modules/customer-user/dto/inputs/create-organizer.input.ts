import { InputType, Field } from '@nestjs/graphql'

import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, ValidateIf } from 'class-validator'

@InputType()
export class CreateOrganizerInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name should be a string' })
  name!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value.websiteLink !== undefined && value.websiteLink !== null)
  @IsUrl({}, { message: 'Invalid URL format' })
  @MaxLength(150, { message: 'Website link should not exceed 150 characters' })
  websiteLink?: string

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Organization bio should be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Organization bio should not exceed 500 characters' })
  organizationBio?: string

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Description should be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description should not exceed 500 characters' })
  description?: string
}
