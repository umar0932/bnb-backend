import { Field, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'

import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class LoginUserInput {
  @Field()
  @IsNotEmpty({
    message: 'Email should not be empty'
  })
  @IsEmail({}, { message: 'Email should be in string' })
  email: string

  @Field()
  @IsNotEmpty()
  @Transform(value => value.toString())
  password: string
}
