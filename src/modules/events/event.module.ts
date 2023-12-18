import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '@app/admin'
import { CustomerUserModule } from '@app/customer-user'
import { LocationsEntity } from '@app/common/entities'

import { CategoryModule } from '@app/category'
import { Event, EventDetailsEntity, EventTicketsEntity } from './entities'
import { EventResolver } from './event.resolver'
import { EventService } from './event.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventDetailsEntity, EventTicketsEntity, LocationsEntity]),
    AdminModule,
    CustomerUserModule,
    CategoryModule
  ],
  providers: [EventResolver, EventService],
  exports: [EventService]
})
export class EventModule {}
