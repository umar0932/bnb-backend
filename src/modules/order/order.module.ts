import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CustomerUserModule } from '@app/customer-user'

import { OrderEntity } from './entities'
import { OrderResolver } from './order.resolver'
import { OrderService } from './order.service'

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), forwardRef(() => CustomerUserModule)],
  providers: [OrderResolver, OrderService],
  exports: [OrderService]
})
export class OrderModule {}
