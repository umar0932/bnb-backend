import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { Category, SubCategory } from '@app/category/entities'
import { CustomBaseEntity, LocationsEntity } from '@app/common/entities'

import { EventDetailsEntity } from './event-details.entity'
import { EventStatus } from '../event.constants'
import { Tickets } from './tickets.entity'

registerEnumType(EventStatus, {
  name: 'EventStatus',
  description: 'The status of event'
})

@Entity({ name: 'event' })
@ObjectType()
export class Event extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ length: 50, unique: true })
  @Field(() => String)
  title!: string

  @Column('timestamptz', { name: 'start_date' })
  @Field(() => Date)
  startDate!: Date

  @Column('timestamptz', { name: 'end_date' })
  @Field(() => Date)
  endDate!: Date

  // Non Complusory Variables

  @Column('simple-array', { name: 'tags', nullable: true })
  @Field(() => [String], { nullable: true })
  tags?: string[]

  @Column({ length: 50, name: 'type', nullable: true })
  @Field(() => String, { nullable: true })
  type?: string

  // Enums

  @Field(() => EventStatus)
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT, name: 'event_status' })
  status!: EventStatus

  // Relations

  @Field(() => LocationsEntity)
  @OneToOne(() => LocationsEntity, { eager: true })
  @JoinColumn({ name: 'location_id' })
  location!: LocationsEntity

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, category => category.events, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category

  @ManyToOne(() => SubCategory, subCategory => subCategory.events, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'ref_id_subCategory' })
  @Field(() => SubCategory, { nullable: true })
  subCategory?: SubCategory

  @Field(() => EventDetailsEntity, { nullable: true })
  @OneToOne(() => EventDetailsEntity, eventDetails => eventDetails.event, {
    eager: true,
    nullable: true
  })
  eventDetails?: EventDetailsEntity

  @Field(() => Tickets, { nullable: true })
  @OneToMany(() => Tickets, eventTicketsEntity => eventTicketsEntity.event, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'ref_id_event_tickets_entity' })
  eventTickets?: Tickets[]
}
