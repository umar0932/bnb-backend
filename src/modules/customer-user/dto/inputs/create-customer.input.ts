import { InputType, Field } from '@nestjs/graphql'

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateCustomerInput {
  @Field(() => String)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  firstName: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  lastName: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  // @Field({ nullable: true })
  // role: Role
}
