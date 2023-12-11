import { InputType, Field, PickType, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

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

  @Field(() => ID)
  @IsNotEmpty({ message: 'Organizer ID cannot be empty' })
  @IsString({ message: 'Organizer ID should be a string' })
  idOrganizerUser!: string
}
