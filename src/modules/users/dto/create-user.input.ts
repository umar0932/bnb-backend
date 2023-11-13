import { InputType, Field } from '@nestjs/graphql'
import { Transform } from 'class-transformer'

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, validate } from 'class-validator'
import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @IsEmail({}, { message: 'Email should be in proper format' })
  @IsNotEmpty({
    message: 'Email should not be empty'
  })
  email: string

  @Field(() => String)
  @Transform(value => value.toString())
  @IsNotEmpty({
    message: 'First Name should not be empty'
  })
  @MinLength(3, { message: 'First Name minimum length is 3 characters' })
  @MaxLength(15)
  firstName: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  lastName: string

  @Field(() => String)
  // @Transform(value => value.toString())
  @IsNotEmpty({
    message: 'password should not be empty'
  })
  @MinLength(8)
  password: string

  // @Field({ nullable: true })
  // role: Role
}
