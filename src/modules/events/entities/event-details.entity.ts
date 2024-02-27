import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities'

import { Event } from './event.entity'

@Entity({ name: 'event_details' })
@ObjectType()
export class EventDetailsEntity extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ length: 500 })
  @Field(() => String)
  summary!: string

  @Column({ length: 500 })
  @Field(() => String)
  description!: string

  @Column({ type: 'simple-array' })
  @Field(() => [String])
  eventImages!: string[]

  // Relations

  @Field(() => Event)
  @OneToOne(() => Event, (event: Event) => event.eventDetails, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'event_id' })
  event: Event
}
