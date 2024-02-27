import { InputType, Field, ID } from '@nestjs/graphql'

import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateSubCategoryInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Category id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Category UUID format' })
  categoryId!: string

  @Field(() => String)
  @IsString({ message: 'Subcategory name should be a string' })
  @IsNotEmpty({ message: 'Subcategory name should not be empty' })
  @MinLength(2, { message: 'Subcategory name should be at least 2 characters long' })
  @MaxLength(50, { message: 'Subcategory name should not exceed 50 characters' })
  subCategoryName!: string
}
