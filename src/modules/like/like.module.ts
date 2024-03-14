import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '@app/admin'
import { CustomerUserModule } from '@app/customer-user'
import { EventModule } from '@app/events'

import { Likes } from './entities'
import { LikeResolver } from './like.resolver'
import { LikeService } from './like.service'

@Module({
  imports: [TypeOrmModule.forFeature([Likes]), AdminModule, CustomerUserModule, EventModule],
  providers: [LikeResolver, LikeService],
  exports: [LikeService]
})
export class LikeModule {}
