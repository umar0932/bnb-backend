import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities'
import { Customer } from '@app/customer-user/entities'
import { Event } from '@app/events/entities'

@Entity({ name: 'ratings' })
@ObjectType()
export class Rating extends CustomBaseEntity {
  // Primary key
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string

  // Complusory Variables

  @Column({ type: 'numeric', name: 'organizer_rating' })
  @Field(() => Number)
  organizerRating!: number

  // Non Complusory Variables

  // Relations

  @Field(() => Event)
  @ManyToOne(() => Event, event => event.ratings, {
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'event_id' })
  event: Event

  @Field(() => Customer)
  @ManyToOne(() => Customer, customer => customer.ratings, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer
}
