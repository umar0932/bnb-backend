import { InputType, Field } from '@nestjs/graphql'

import { IsNotEmpty, IsUUID } from 'class-validator'

@InputType()
export class CreateLikeInput {
  // Complusory Variables

  // Relations

  @Field(() => String)
  @IsNotEmpty({ message: 'Event id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Event UUID format' })
  eventId!: string

  // Non Complusory Variables
}
