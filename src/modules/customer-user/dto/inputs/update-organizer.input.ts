import { InputType, Field, PickType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

import { CreateOrganizerInput } from './create-organizer.input'

@InputType()
export class UpdateOrganizerInput extends PickType(CreateOrganizerInput, [
  'websiteLink',
  'organizationBio',
  'description'
]) {
  @Field(() => String)
  @IsOptional()
  @IsString({ message: 'Name should be a string' })
  name?: string
}
