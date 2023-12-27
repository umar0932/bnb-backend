import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CustomerUserModule } from '@app/customer-user'
import { OrderModule } from '@app/order'

import { PaymentResolver } from './payment.resolver'
import { PaymentService } from './payment.service'

@Module({
  imports: [ConfigModule, forwardRef(() => CustomerUserModule), OrderModule],
  providers: [PaymentService, PaymentResolver],
  exports: [PaymentService]
})
export class PaymentModule {}
