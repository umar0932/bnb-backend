import { Field, InputType } from '@nestjs/graphql'

import { OrganizerEventFilterInput } from './organizer-event-filter.input'
import { IsOptional } from 'class-validator'

@InputType()
export class ListOrganizerEventsInputs {
  @Field(() => OrganizerEventFilterInput, { nullable: true })
  @IsOptional()
  filter?: OrganizerEventFilterInput

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
