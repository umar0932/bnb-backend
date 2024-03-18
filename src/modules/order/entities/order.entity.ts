import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities'
import { Customer } from '@app/customer-user/entities'
import { Event } from '@app/events/entities'

import { OrderStatus, TicketType } from '../types'

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'The status of order'
})

@Entity('orders')
@ObjectType()
export class OrderEntity extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ name: 'payment_intent_id' })
  @Field(() => String)
  paymentIntentId!: string

  @Column({ name: 'stripe_customer_id' })
  @Field(() => String)
  stripeCustomerId!: string

  @Column('float', { default: 0.0, name: 'total_price' })
  @Field(() => Number)
  totalPrice!: number

  @Column({ type: 'simple-json', name: 'tickets_json' })
  @Field(() => [TicketType])
  tickets!: TicketType[]

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING, name: 'order_status' })
  @Field(() => OrderStatus)
  orderStatus!: OrderStatus

  // Relations

  @Field(() => Event)
  @ManyToOne(() => Event, event => event.orders, {
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'event_id' })
  event: Event

  @Field(() => Customer)
  @ManyToOne(() => Customer, customer => customer.orders, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer
}
