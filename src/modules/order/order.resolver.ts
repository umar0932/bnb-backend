import { Resolver, Query } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload } from '@app/common'

import { OrderEntity } from './entities'

import { OrderService } from './order.service'

@Resolver(() => OrderEntity)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderEntity], { description: 'This will get all Orders of Current Customer' })
  @Allow()
  getOrdersOfCustomer(@CurrentUser() user: JwtUserPayload): Promise<OrderEntity[]> {
    return this.orderService.getOrdersOfCustomer(user.userId)
  }
}
