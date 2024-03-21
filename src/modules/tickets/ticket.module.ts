import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '@app/admin'
import { CustomerUserModule } from '@app/customer-user'
import { EventModule } from '@app/events'

import { Tickets } from './entities'
import { TicketResolver } from './ticket.resolver'
import { TicketService } from './ticket.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Tickets]),
    AdminModule,
    forwardRef(() => CustomerUserModule),
    EventModule
  ],
  providers: [TicketResolver, TicketService],
  exports: [TicketService]
})
export class TicketModule {}
