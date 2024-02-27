import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'

import { SubCategory } from './sub-category.entity'
import { Event } from '@app/events/entities'

@Entity({ name: 'category' })
@ObjectType()
export class Category extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ length: 50, name: 'category_name', unique: true })
  @Field(() => String)
  categoryName!: string

  // Relations

  @Field(() => [SubCategory], { nullable: true })
  @OneToMany(() => SubCategory, subCategory => subCategory.category, {
    eager: true,
    nullable: true
  })
  subCategories?: SubCategory[]

  @Field(() => Event, { nullable: true })
  @OneToMany(() => Event, event => event.category, {
    nullable: true
  })
  events?: Event[]
}
