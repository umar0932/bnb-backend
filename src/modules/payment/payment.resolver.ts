import { Resolver, Mutation, Args } from '@nestjs/graphql'

import { Allow, SuccessResponse } from '@app/common'
import { OrderService } from '@app/order'

import { PaymentService } from './payment.service'
import { CreateChargeInput } from './dto/input'
import { CreateOrderInput } from '@app/order/dto/inputs'

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService
  ) {}

  @Mutation(() => SuccessResponse, { description: 'This will charge the Customer on test stripe' })
  @Allow()
  async testCharge(
    @Args('chargeInput') chargeInput: CreateChargeInput,
    @Args('orderInput') orderInput: CreateOrderInput
  ): Promise<SuccessResponse> {
    const charge = await this.paymentService.charge(chargeInput)

    if (charge) await this.orderService.createOrder(orderInput, chargeInput.customerId, charge)

    return { success: true, message: 'Charge and Order Created' }
  }
}
