import { InputType, Field } from '@nestjs/graphql'

import { IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class SendEmailInput {
  // Complusory Variables

  // Relations

  @Field()
  @IsNotEmpty({ message: 'Recipients cannot be empty' })
  recipients!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Subject cannot be empty' })
  subject!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Html cannot be empty' })
  html!: string

  // Non Complusory Variables

  @Field()
  @IsNotEmpty({ message: 'From cannot be empty' })
  from?: string

  @Field()
  @IsOptional()
  placeHolderReplacements?: Record<string, string>

  @Field(() => String)
  @IsOptional()
  text?: string
}
