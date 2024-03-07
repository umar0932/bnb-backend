import { Field, InputType } from '@nestjs/graphql'

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class ForgotPasswordInput {
  @Field(() => String)
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email!: string
}

@InputType()
export class ResetForgotPasswordInput extends ForgotPasswordInput {
  @Field(() => String)
  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Code cannot be empty' })
  code!: string

  @Field(() => String)
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string
}
