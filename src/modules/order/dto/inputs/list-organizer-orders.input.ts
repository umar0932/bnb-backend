import { Field, InputType } from '@nestjs/graphql'

import { IsOptional } from 'class-validator'

import { OrganizerOrderFilterInput } from './organizer-order-filter.input'

@InputType()
export class ListOrganizerOrdersInputs {
  @Field(() => OrganizerOrderFilterInput, { nullable: true })
  @IsOptional()
  filter?: OrganizerOrderFilterInput

  @Field(() => Number, { name: 'limit', nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => Number, { name: 'offset', nullable: true })
  @IsOptional()
  offset?: number
}
