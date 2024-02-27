import { Field, ID, InputType, PickType } from '@nestjs/graphql'

import { IsNotEmpty, IsUUID } from 'class-validator'

import { CreateSubCategoryInput } from './create-sub-category.input'

@InputType()
export class UpdateSubCategoryInput extends PickType(CreateSubCategoryInput, [
  'categoryId',
  'subCategoryName'
]) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'SubCategory id cannot be empty' })
  @IsUUID('4', { message: 'Invalid SubCategory UUID format' })
  id!: string
}
