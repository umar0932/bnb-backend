import { Field, ID, InputType, PickType } from '@nestjs/graphql'

import { IsNotEmpty, IsNumber } from 'class-validator'

import { CreateSubCategoryInput } from './create-sub-category.input'

@InputType()
export class UpdateSubCategoryInput extends PickType(CreateSubCategoryInput, [
  'idCategory',
  'subCategoryName'
]) {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Subcategory ID should not be empty' })
  @IsNumber({}, { message: 'Subcategory ID should be a number' })
  idSubCategory!: number
}
