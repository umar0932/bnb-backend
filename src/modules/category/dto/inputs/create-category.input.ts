import { InputType, Field } from '@nestjs/graphql'

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  categoryName: string
}
