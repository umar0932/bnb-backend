import { Field, InputType } from '@nestjs/graphql'

import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

@InputType()
export class CreateChargeInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  paymentMethodId: string

  @IsNumber()
  @Field()
  amount: number

  @IsString()
  @IsNotEmpty()
  @Field()
  customerId: string
}

export default CreateChargeInput
