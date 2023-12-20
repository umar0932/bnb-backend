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

import { CustomBaseEntity } from '@app/common/entities/base.entity'
import { Category, SubCategory } from '@app/category/entities'
import { LocationsEntity } from '@app/common/entities'
import { EventStatus } from '../event.constants'
import { EventDetailsEntity } from './event-details.entity'
import { EventTicketsEntity } from './event-tickets.entity'

registerEnumType(EventStatus, {
  name: 'EventStatus',
  description: 'The status of event'
})

@Entity({ name: 'event' })
@ObjectType()
export class Event extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  idEvent!: number

  @Column({ length: 50, name: 'event_title', unique: true })
  @Field()
  eventTitle!: string

  @ManyToOne(() => Category, category => category.events, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'ref_id_category' })
  @Field(() => Category, { nullable: true })
  category: Category

  @ManyToOne(() => SubCategory, subCategory => subCategory.events, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'ref_id_subCategory' })
  @Field(() => SubCategory, { nullable: true })
  subCategory: SubCategory

  @Column('simple-array', { name: 'tags', nullable: true })
  @Field(() => [String], { nullable: true })
  tags?: string[]

  @Column({ length: 50, name: 'type', nullable: true })
  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => LocationsEntity)
  @OneToOne(() => LocationsEntity, { eager: true })
  @JoinColumn({ name: 'ref_id_location' })
  location!: LocationsEntity

  @Field(() => EventDetailsEntity, { nullable: true })
  @OneToOne(() => EventDetailsEntity, eventDetails => eventDetails.event, {
    eager: true,
    nullable: true
  })
  eventDetails?: EventDetailsEntity

  @Field(() => EventStatus)
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT, name: 'event_status' })
  eventStatus!: EventStatus

  @Field(() => EventTicketsEntity, { nullable: true })
  @OneToMany(() => EventTicketsEntity, eventTicketsEntity => eventTicketsEntity.event, {
    eager: true,
    nullable: true,
    cascade: true
  })
  @JoinColumn({ name: 'ref_id_event_tickets_entity' })
  eventTickets?: EventTicketsEntity[]

  @Column('timestamptz', { name: 'start_date' })
  @Field(() => Date)
  startDate!: Date

  @Column('timestamptz', { name: 'end_date' })
  @Field(() => Date)
  endDate!: Date
}
