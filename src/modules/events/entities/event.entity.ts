import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'
import { Category, SubCategory } from '@app/category/entities'
import { LocationsEntity } from '@app/common/entities'

@Entity({ name: 'event' })
@ObjectType()
export class Event extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  idEvent!: number

  @Column({ length: 50, name: 'event_title', unique: true })
  @Field()
  eventTitle!: string

  @Field(() => Category, { nullable: true })
  @OneToMany(() => Category, Category => Category.event, {
    nullable: true,
    eager: true
  })
  @JoinColumn({ name: 'ref_id_category' })
  categories?: Category[]

  @OneToMany(() => SubCategory, subCategory => subCategory.event, {
    nullable: true,
    eager: true
  })
  @Field(() => [SubCategory], { nullable: true })
  subCategories: SubCategory[]

  @Column('simple-array', { name: 'tags', nullable: true })
  @Field(() => [String], { nullable: true })
  tags?: string[]

  @Column({ length: 50, name: 'type', nullable: true })
  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => LocationsEntity)
  @OneToOne(() => LocationsEntity, { eager: true })
  @JoinColumn({ name: 'ref_id_location' })
  location: LocationsEntity

  @Column('timestamptz', { name: 'start_date' })
  @Field(() => Date)
  startDate!: Date

  @Column('timestamptz', { name: 'end_date' })
  @Field(() => Date)
  endDate!: Date
}
