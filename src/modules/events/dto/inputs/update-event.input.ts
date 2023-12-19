import { InputType, Field, PickType, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber } from 'class-validator'

import { CreateBasicEventInput } from './create-event.input'

@InputType()
export class UpdateBasicEventInput extends PickType(CreateBasicEventInput, [
  'eventTitle',
  'refIdCategory',
  'refIdSubCategory',
  'tags',
  'type',
  'location',
  'startDate',
  'endDate'
]) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Event ticket cannot be empty' })
  @IsNumber({}, { message: 'Event ID must be a number' })
  idEvent!: number
}
