import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as _ from 'lodash'
import Stripe from 'stripe'

import { CreateOrderInput } from '@app/order/dto/inputs'
import { CustomerUserService } from '@app/customer-user'
import { OrderService } from '@app/order'
import { SuccessResponse } from '@app/common'

import { CreateChargeInput } from './dto/input'

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name)
  private stripe: Stripe

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => CustomerUserService))
    private customerService: CustomerUserService,
    private readonly orderService: OrderService
  ) {
    const stripeSecretKey = configService.get<string>('stripe.secret')

    if (stripeSecretKey === undefined)
      throw new Error('Stripe secret key is missing in the configuration')

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    })
  }

  async createStripeCustomer(name: string, email: string) {
    try {
      return await this.stripe.customers.create({
        name,
        email
      })
    } catch (err) {
      throw new BadRequestException('User not registered on Stripe')
    }
  }

  async charge(
    chargeInput: CreateChargeInput,
    orderInput: CreateOrderInput
  ): Promise<SuccessResponse> {
    try {
      const customer = await this.customerService.getCustomerById(chargeInput.customerId)

      const stripeStripeCurrency = this.configService.get<string>('stripe.currency')

      if (stripeStripeCurrency === undefined)
        throw new Error('Stripe currency is missing in the configuration')

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: _.round(chargeInput.amount * 100, 2),
        customer: customer.stripeCustomerId,
        payment_method: chargeInput.paymentMethodId,
        currency: stripeStripeCurrency,
        confirm: true,
        off_session: true
      })

      if (paymentIntent.id)
        await this.orderService.createOrder(orderInput, chargeInput.customerId, paymentIntent.id)

      return { success: true, message: 'Charge and Order Created' }
    } catch (err) {
      this.logger.error(err?.message, err, 'PaymentService')
      throw new BadRequestException("Something went wrong while charging the customer's card.")
    }
  }
}
