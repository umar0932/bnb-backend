import { InputType, Field } from '@nestjs/graphql'

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateCustomerInput {
  @Field(() => String)
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email!: string

  @Field(() => String)
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @MinLength(3, { message: 'First name must be at least 3 characters long' })
  @MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
  firstName!: string

  @Field(() => String)
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @MinLength(3, { message: 'Last name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Last name cannot be longer than 50 characters' })
  lastName!: string

  @Field(() => String)
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string
}
