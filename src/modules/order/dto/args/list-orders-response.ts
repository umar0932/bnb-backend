import { Field, Int, ObjectType } from '@nestjs/graphql'

import { RelayTypes } from '@app/common'
import { OrderEntity } from '@app/order/entities'

@ObjectType()
export class EventOrderResponse extends RelayTypes<OrderEntity>(OrderEntity) {}

@ObjectType()
export class ListOrdersResponse {
  @Field(() => [OrderEntity])
  results: OrderEntity[]

  @Field(() => Number, { nullable: true })
  totalRows?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
