import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'
import { Customer } from '@app/customer-user/entities'
import { Event } from '@app/events/entities'

@Entity({ name: 'likes' })
@ObjectType()
export class Likes extends CustomBaseEntity {
  // Primary key
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  // Relations

  @Field(() => Customer, { nullable: true })
  @ManyToOne(() => Customer, (user: Customer) => user.likes, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: Customer

  @Field(() => Event, { nullable: true })
  @ManyToOne(() => Event, (event: Event) => event.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'event_id' })
  event: Event
}
