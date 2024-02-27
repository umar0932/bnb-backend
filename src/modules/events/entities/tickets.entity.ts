import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities'

import { Event } from './event.entity'
import { TicketsSalesChannel } from '../event.constants'

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

  @Column({ length: 50, name: 'ticket_name' })
  @Field(() => String)
  ticketName: string

  @Column({ name: 'available_quantity' })
  @Field(() => Number)
  availableQuantity: number

  @Column({ name: 'ticket_price', type: 'numeric' })
  @Field(() => Number)
  ticketPrice: number

  @Column('timestamptz', { name: 'start_date' })
  @Field(() => Date)
  startDate!: Date

  @Column('timestamptz', { name: 'end_date' })
  @Field(() => Date)
  endDate!: Date

  @Column({ length: 50, name: 'description', nullable: true })
  @Field(() => String, { nullable: true })
  ticketDescription: string

  @Column({ nullable: true, default: true, name: 'is_visible' })
  @Field(() => Boolean, { nullable: true })
  isVisible?: boolean

  @Column({ name: 'minimum_quantity' })
  @Field(() => Number)
  minQuantity: number

  @Column({ name: 'maximum_quantity' })
  @Field(() => Number)
  maxQuantity: number

  @ManyToOne(() => Event, event => event.eventTickets)
  @JoinColumn({ name: 'event_id' })
  @Field(() => Event, { nullable: true })
  event: Event
}
