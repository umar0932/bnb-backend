import { Body, Controller, Post, Req } from '@nestjs/common'

import Stripe from 'stripe'
import { PaymentService } from './payment.service'

@Controller('stripe')
export class StripeController {
  constructor(private payementService: PaymentService) {}

  @Post()
  createSubscriptionSession(
    @Req() request,
    @Body() priceId: string
  ): Promise<Stripe.Response<Stripe.Checkout.Session> | undefined> {
    return this.payementService.createSubscriptionSession(request.user, priceId)
  }

  @Post('portal-session')
  updatePlan(@Req() request): Promise<Stripe.Response<Stripe.BillingPortal.Session>> {
    return this.payementService.getPortal(request.user.customerId)
  }
}
