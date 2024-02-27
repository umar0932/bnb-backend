import { Field, InputType, Int } from '@nestjs/graphql'

import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

@InputType()
export class CreateChargeInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  paymentMethodId: string

  @IsNumber()
  @Field(() => Int)
  amount: number

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  customerId: string
}

export default CreateChargeInput
