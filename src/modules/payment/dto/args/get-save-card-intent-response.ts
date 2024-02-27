import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GetSaveCardIntentResponse {
  @Field(() => String)
  setupIntent: string

  @Field(() => String)
  ephemeralKey: string

  @Field(() => String)
  publishableKey: string

  @Field(() => String)
  customer: string
}
