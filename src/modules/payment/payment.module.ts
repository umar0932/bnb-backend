import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { StripeModule, StripeModuleConfig } from '@golevelup/nestjs-stripe'
import { CustomerUserModule } from '@app/customer-user'
import { OrderModule } from '@app/order'

import { PaymentResolver } from './payment.resolver'
import { PaymentService } from './payment.service'
import { StripeController } from './stripe.controller'
import { StripeWebhooksService } from './stripe-webhook.service'

@Module({
  imports: [
    ConfigModule,
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<StripeModuleConfig> => {
        const stripeConfig = configService.get<StripeModuleConfig>('stripeConfig')
        if (!stripeConfig) throw new Error('Stripe configuration is missing')

        console.log('stripeConfig---->>>>', stripeConfig)

        return stripeConfig
      },
      inject: [ConfigService]
    }),
    forwardRef(() => CustomerUserModule),
    OrderModule
  ],
  controllers: [StripeController],
  providers: [PaymentService, PaymentResolver, StripeWebhooksService],
  exports: [PaymentService]
})
export class PaymentModule {}
