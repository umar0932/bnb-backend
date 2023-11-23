import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class LoginAdminInput {
  @Field(() => String)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string
}
