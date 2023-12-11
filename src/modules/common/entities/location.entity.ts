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
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  idLocation!: number

  @Field(() => String)
  @Column({ name: 'venue_name' })
  venueName!: string

  @Field(() => String)
  @Column({ name: 'street_address' })
  streetAddress!: string

  @Field(() => String)
  @Column({ length: 70 })
  country!: string

  @Field(() => String)
  @Column({ length: 70 })
  city!: string

  @Field(() => String, { nullable: true })
  @Column({ length: 70, nullable: true })
  state?: string

  @Field(() => String)
  @Column({ length: 10 })
  postalCode!: string

  @Field(() => String)
  @Column({ length: 50 })
  lat!: string

  @Field(() => String)
  @Column({ length: 50 })
  long!: string

  @Field(() => LocationTypes)
  @Column({ type: 'enum', enum: LocationTypes, name: 'location_type' })
  locationType!: LocationTypes

  @Field(() => String, { nullable: true })
  @Column({ length: 100, nullable: true })
  placeId?: string
}
