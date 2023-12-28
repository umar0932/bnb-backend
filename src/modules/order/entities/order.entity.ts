import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities'

import { OrderStatus, TicketType } from '../types'

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'The status of order'
})

@Entity('orders')
@ObjectType()
export class OrderEntity extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  idOrder: string

  @Column({ name: 'event_id' })
  @Field(() => Int)
  idEvent: number

  @Column({ name: 'payment_intent_id' })
  @Field(() => String)
  paymentIntentId: string

  @Column({ name: 'stripe_customer_id' })
  @Field(() => String)
  stripeCustomerId: string

  @Column('numeric', { default: 0.0, name: 'total_price' })
  @Field(() => Number)
  totalPrice: number

  @Column({ type: 'simple-json', name: 'tickets_json' })
  @Field(() => TicketType)
  tickets: TicketType

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING, name: 'order_status' })
  @Field(() => OrderStatus)
  orderStatus: OrderStatus
}
