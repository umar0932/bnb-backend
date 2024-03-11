import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '@app/admin'
import { CustomerUserModule } from '@app/customer-user'
import { EventModule } from '@app/events'

import { RatingService } from './rating.service'
import { RatingResolver } from './rating.resolver'
import { Rating } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), AdminModule, CustomerUserModule, EventModule],
  providers: [RatingResolver, RatingService],
  exports: [RatingService]
})
export class RatingModule {}
