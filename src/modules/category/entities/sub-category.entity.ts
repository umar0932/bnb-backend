import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'

import { Category } from './category.entity'
import { Event } from '@app/events/entities'

@Entity({ name: 'sub_category' })
@ObjectType()
export class SubCategory extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ length: 50, name: 'sub_category_name', unique: true })
  @Field(() => String)
  subCategoryName!: string

  // Relations

  @Field(() => Category)
  @ManyToOne(() => Category, category => category.subCategories, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category

  @OneToMany(() => Event, event => event.subCategory, {
    nullable: true
  })
  @Field(() => [Event], { nullable: true })
  events?: Event[]
}
