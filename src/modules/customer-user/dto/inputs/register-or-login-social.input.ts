import { Field, InputType } from '@nestjs/graphql'

import { SocialProviderTypes } from '@app/common'

@InputType()
export class RegisterOrLoginSocialInput {
  @Field(() => String)
  accessToken: string

  @Field(() => SocialProviderTypes)
  provider: SocialProviderTypes
}
