import { ObjectType, Field, ID, registerEnumType, Int } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities'

import { Event } from './event.entity'
import { TicketsSalesChannel } from '../event.constants'
import { Customer } from '@app/customer-user/entities'

registerEnumType(TicketsSalesChannel, {
  name: 'TicketsSalesChannel',
  description: 'The tickets sales channel'
})

@Entity({ name: 'tickets' })
@ObjectType()
export class Tickets extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ length: 50 })
  @Field(() => String)
  title!: string

  @Column({ type: 'numeric', name: 'available_quantity' })
  @Field(() => Int)
  availableQuantity!: number

  @Column('float', { default: 0.0, name: 'price' })
  @Field(() => Number)
  price!: number

  @Column({ name: 'minimum_quantity', type: 'numeric' })
  @Field(() => Int)
  minQuantity: number

  @Column({ name: 'maximum_quantity', type: 'numeric' })
  @Field(() => Int)
  maxQuantity: number

  @Column('timestamptz', { name: 'start_date' })
  @Field(() => Date)
  startDate!: Date

  @Column('timestamptz', { name: 'end_date' })
  @Field(() => Date)
  endDate!: Date

  // Non Complusory Variables

  @Column({ length: 50, name: 'description', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string

  @Column({ nullable: true, default: true, name: 'is_visible' })
  @Field(() => Boolean, { nullable: true })
  isVisible?: boolean

  @Column({ type: 'bigint', name: 'tickets_sold', default: 0 })
  @Field(() => Int, { nullable: true })
  ticketsSold?: number

  @Column({ type: 'bigint', name: 'gross_total', default: 0 })
  @Field(() => Int, { nullable: true })
  grossTotal?: number

  // Relations

  @Field(() => Event)
  @ManyToOne(() => Event, event => event.eventTickets, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'event_id' })
  event: Event

  @Field(() => Customer, { nullable: true })
  @ManyToOne(() => Customer, customer => customer.orders, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer
}
