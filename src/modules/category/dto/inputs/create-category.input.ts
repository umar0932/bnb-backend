import { InputType, Field } from '@nestjs/graphql'

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsString({ message: 'Category name must be a string' })
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Category name cannot be longer than 50 characters' })
  categoryName: string
}
