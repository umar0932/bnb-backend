import { Field, InputType } from '@nestjs/graphql'

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class LoginCustomerInput {
  @Field(() => String)
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email!: string

  @Field(() => String)
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string
}
