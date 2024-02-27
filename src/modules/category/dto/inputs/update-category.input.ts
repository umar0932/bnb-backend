import { InputType, Field, PickType, ID } from '@nestjs/graphql'

import { IsNotEmpty, IsUUID } from 'class-validator'

import { CreateCategoryInput } from './create-category.input'

@InputType()
export class UpdateCategoryInput extends PickType(CreateCategoryInput, ['categoryName']) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Category id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Category UUID format' })
  id!: string
}
