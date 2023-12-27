import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GetSaveCardIntentResponse {
  @Field()
  setupIntent: string

  @Field()
  ephemeralKey: string

  @Field()
  publishableKey: string

  @Field()
  customer: string
}
