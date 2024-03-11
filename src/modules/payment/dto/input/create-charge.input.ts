import { Field, InputType, Int } from '@nestjs/graphql'

import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator'

@InputType()
export class CreateChargeInput {
  @IsString({ message: 'Payment Method must be a string' })
  @IsNotEmpty({ message: 'Payment Method id cannot be empty' })
  @Field(() => String)
  paymentMethodId: string

  @IsNumber({}, { message: 'Amount must be a number' })
  @Field(() => Int)
  amount: number

  @Field(() => String)
  @IsNotEmpty({ message: 'Customer id cannot be empty' })
  @IsUUID('4', { message: 'Invalid Customer UUID format' })
  customerId!: string
}

export default CreateChargeInput
