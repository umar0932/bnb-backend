import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'
import { Event } from './event.entity'

@Entity({ name: 'event_details' })
@ObjectType()
export class EventDetailsEntity extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  idEventDetails!: number

  @Column({ length: 150, name: 'event_summary' })
  @Field(() => String)
  eventSummary: string

  @Column({ length: 350, name: 'event_description' })
  @Field(() => String)
  eventDescription: string

  @Field(() => Event)
  @OneToOne(() => Event, event => event.eventDetails)
  @JoinColumn({ name: 'ref_id_event' })
  event: Event
}