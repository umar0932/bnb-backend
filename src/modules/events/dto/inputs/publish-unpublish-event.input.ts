import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'

@InputType()
export class PublishOrUnPublishEventInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Event id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Event UUID format' })
  eventId!: string

  @Field(() => Boolean, { nullable: true })
  publish?: boolean
}
