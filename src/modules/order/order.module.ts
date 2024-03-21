import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CustomerUserModule } from '@app/customer-user'
import { EventModule } from '@app/events'
import { TicketModule } from '@app/tickets'

import { OrderEntity } from './entities'
import { OrderResolver } from './order.resolver'
import { OrderService } from './order.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    forwardRef(() => CustomerUserModule),
    forwardRef(() => EventModule),
    TicketModule
  ],
  providers: [OrderResolver, OrderService],
  exports: [OrderService]
})
export class OrderModule {}
