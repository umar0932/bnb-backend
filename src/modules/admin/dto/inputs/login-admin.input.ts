import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class LoginAdminInput {
  @Field(() => String)
  @IsString({ message: 'Email should be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string

  @Field(() => String)
  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string
}
