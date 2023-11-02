import { InputType, Field } from '@nestjs/graphql'

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, validate } from 'class-validator'
import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Minimum length is 3 characters' })
  @MaxLength(15)
  firstName: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  lastName: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  // @Field({ nullable: true })
  // role: Role
}
