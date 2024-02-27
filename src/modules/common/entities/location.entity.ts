import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { LocationTypes } from '../types'

registerEnumType(LocationTypes, {
  name: 'LocationTypes',
  description: 'The type of location for an event (ONLINE_EVENT or VENUE_EVENT)'
})

@Entity({ name: 'location' })
@ObjectType()
export class LocationsEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ name: 'venue_name' })
  @Field(() => String)
  venueName!: string

  @Column({ name: 'street_address' })
  @Field(() => String)
  streetAddress!: string

  @Column({ length: 70 })
  @Field(() => String)
  country!: string

  @Column({ length: 70 })
  @Field(() => String)
  city!: string

  @Column({ length: 10 })
  @Field(() => String)
  postalCode!: string

  @Column({ length: 50 })
  @Field(() => String)
  lat!: string

  @Column({ length: 50 })
  @Field(() => String)
  long!: string

  // Non Complusory Variables

  @Column({ length: 70, nullable: true })
  @Field(() => String, { nullable: true })
  state?: string

  @Column({ length: 100, name: 'place_id', nullable: true })
  @Field(() => String, { nullable: true })
  placeId?: string

  // Enums

  @Column({ type: 'enum', enum: LocationTypes, name: 'location_type' })
  @Field(() => LocationTypes)
  locationType!: LocationTypes
}
