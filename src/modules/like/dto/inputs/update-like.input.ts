import { InputType, PickType } from '@nestjs/graphql'

import { CreateLikeInput } from './create-like.input'

@InputType()
export class UpdateLikeInput extends PickType(CreateLikeInput, ['eventId']) {}
