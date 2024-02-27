import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'

@InputType()
export class UpdateAdminUserInput {
  @Field(() => String, { nullable: true })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string

  @Field(() => String, { nullable: true })
  @IsString({ message: 'First name must be a string' })
  @MinLength(3, { message: 'First name must be at least 3 characters long' })
  @MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
  @IsOptional()
  firstName?: string

  @Field(() => String, { nullable: true })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(3, { message: 'Last name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Last name cannot be longer than 50 characters' })
  @IsOptional()
  lastName?: string

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsString({ message: 'MediaUrl must be a string' })
  @IsOptional()
  profileImage?: string
}
