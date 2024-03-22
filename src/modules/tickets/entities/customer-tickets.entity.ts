import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities'
import { Customer } from '@app/customer-user/entities'
import { Event } from '@app/events/entities'

import { PaymentType } from '../ticket.constants'
import { Tickets } from './tickets.entity'

registerEnumType(PaymentType, {
  name: 'PaymentType',
  description: 'The Payment Type'
})

@Entity({ name: 'customer_event_tickets' })
@ObjectType()
export class CustomerTickets extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // Complusory Variables

  @Column('float', { default: 0.0, name: 'price' })
  @Field(() => Number)
  price!: number

  // Non Complusory Variables

  @Column({ nullable: true, default: false, name: 'is_checked_in' })
  @Field(() => Boolean, { nullable: true })
  isCheckedIn?: boolean

  @Column('timestamptz', { name: 'check_in_time', nullable: true })
  @Field(() => Date, { nullable: true })
  checkInTime?: Date

  //   Enums

  @Field(() => PaymentType)
  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.ONLINE,
    name: 'payment_type'
  })
  paymentType!: PaymentType

  // Relations
  @Field(() => Tickets)
  @ManyToOne(() => Tickets, ticket => ticket.customerTickets, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket!: Tickets

  @Field(() => Event)
  @ManyToOne(() => Event, event => event.customerTickets, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event

  @Field(() => Customer)
  @ManyToOne(() => Customer, customer => customer.customerTickets, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer
}
