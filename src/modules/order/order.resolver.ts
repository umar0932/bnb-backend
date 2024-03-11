import { Resolver, Query, Args } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload } from '@app/common'

import { OrderEntity } from './entities'

import { ListOrdersInputs } from './dto/inputs'
import { ListOrdersResponse } from './dto/args'
import { OrderService } from './order.service'

@Resolver(() => OrderEntity)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderEntity], { description: 'This will get all Orders of Current Customer' })
  @Allow()
  getOrdersOfCustomer(@CurrentUser() user: JwtUserPayload): Promise<OrderEntity[]> {
    return this.orderService.getOrdersOfCustomer(user.userId)
  }

  @Query(() => ListOrdersResponse, {
    description: 'The List of Event Tickets with Pagination and filters'
  })
  @Allow()
  async getOrders(@Args('input') listOrdersInputs: ListOrdersInputs): Promise<ListOrdersResponse> {
    const [orders, count, limit, offset] =
      await this.orderService.getOrdersWithPagination(listOrdersInputs)
    return { results: orders, totalRows: count, limit, offset }
  }
}
