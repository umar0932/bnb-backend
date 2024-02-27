import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '@app/admin'
import { AwsS3ClientModule } from '@app/aws-s3-client'
import { CustomerUserModule } from '@app/customer-user'
import { LocationsEntity } from '@app/common/entities'

import { CategoryModule } from '@app/category'
import { Event, EventDetailsEntity, Tickets } from './entities'
import { EventResolver } from './event.resolver'
import { EventService } from './event.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventDetailsEntity, Tickets, LocationsEntity]),
    AdminModule,
    AwsS3ClientModule,
    CustomerUserModule,
    CategoryModule
  ],
  providers: [EventResolver, EventService],
  exports: [EventService]
})
export class EventModule {}
