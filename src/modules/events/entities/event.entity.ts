import { ObjectType, Field, ID, registerEnumType, Int } from '@nestjs/graphql'

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
import { Likes } from '@app/like/entities'
import { OrderEntity } from '@app/order/entities'
import { Rating } from '@app/rating/entities'

import { EventDetailsEntity } from './event-details.entity'
import { EventLocationType, EventStatus } from '../event.constants'
import { Tickets } from './tickets.entity'

registerEnumType(EventStatus, {
  name: 'EventStatus',
  description: 'The status of event'
})

registerEnumType(EventLocationType, {
  name: 'EventLocationType',
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

  @Column({ type: 'bigint', name: 'like_count', default: 0 })
  @Field(() => Int, { nullable: true })
  likeCount?: number

  @Column('simple-array', { name: 'tags', nullable: true })
  @Field(() => [String], { nullable: true })
  tags?: string[]

  @Column({ length: 50, name: 'type', nullable: true })
  @Field(() => String, { nullable: true })
  type?: string

  @Column({ length: 255, nullable: true, name: 'meeting_url' })
  @Field(() => String, { nullable: true })
  meetingUrl?: string

  // Enums

  @Field(() => EventStatus)
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT, name: 'event_status' })
  status!: EventStatus

  @Field(() => EventLocationType)
  @Column({
    type: 'enum',
    enum: EventLocationType,
    default: EventLocationType.ONSITE,
    name: 'event_location_type'
  })
  eventLocationType!: EventLocationType

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
  @JoinColumn({ name: 'subCategory_id' })
  @Field(() => SubCategory, { nullable: true })
  subCategory?: SubCategory

  @Field(() => EventDetailsEntity, { nullable: true })
  @OneToOne(() => EventDetailsEntity, eventDetails => eventDetails.event, {
    eager: true,
    nullable: true
  })
  eventDetails?: EventDetailsEntity

  @Field(() => [Tickets], { nullable: true })
  @OneToMany(() => Tickets, eventTickets => eventTickets.event, {
    eager: true,
    nullable: true
  })
  eventTickets?: Tickets[]

  @Field(() => [Likes], { nullable: true })
  @OneToMany(() => Likes, (like: Likes) => like.event, {
    eager: true,
    nullable: true
  })
  likes?: Likes[]

  @Field(() => [Rating], { nullable: true })
  @OneToMany(() => Rating, rating => rating.event, {
    eager: true,
    nullable: true
  })
  ratings?: Rating[]

  @Field(() => [OrderEntity], { nullable: true })
  @OneToMany(() => OrderEntity, orderEntity => orderEntity.event, {
    eager: true,
    nullable: true
  })
  orders?: OrderEntity[]
}
