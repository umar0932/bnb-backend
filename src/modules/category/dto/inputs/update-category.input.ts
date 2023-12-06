import { InputType, Field, PickType, ID } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber } from 'class-validator'

import { CreateCategoryInput } from './create-category.input'

@InputType()
export class UpdateCategoryInput extends PickType(CreateCategoryInput, ['categoryName']) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Category ID should not be empty' })
  @IsNumber({}, { message: 'Category ID should be a number' })
  idCategory!: number
}
