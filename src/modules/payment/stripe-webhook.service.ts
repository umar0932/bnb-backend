import { Injectable, Logger } from '@nestjs/common'

import { InjectStripeClient, StripeWebhookHandler } from '@golevelup/nestjs-stripe'
import Stripe from 'stripe'

@Injectable()
export class StripeWebhooksService {
  private readonly logger = new Logger(StripeWebhooksService.name)

  constructor(@InjectStripeClient() private stripe: Stripe) {}

  @StripeWebhookHandler('payment_intent.succeeded')
  async handlePaymentIntentSucceeded(event: Stripe.Event): Promise<void> {
    try {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent---->>>', paymentIntent)
    } catch (error) {
      this.logger.error('Error processing webhook logger:', error)
      console.error('Error processing webhook:', error)
    }
  }
}
