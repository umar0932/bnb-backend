import { Field, InputType } from '@nestjs/graphql'

import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { SocialProviderTypes } from '@app/common'

@InputType()
export class RegisterOrLoginSocialInput {
  @Field()
  accessToken: string

  @Field(() => SocialProviderTypes)
  provider: SocialProviderTypes

  @Field(() => String)
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string
}
