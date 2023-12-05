import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'

import { SubCategory } from './sub-category.entity'

@Entity({ name: 'category' })
@ObjectType()
export class Category extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  idCategory!: number

  @Column({ length: 50, name: 'category_name', unique: true })
  @Field()
  categoryName!: string

  @OneToMany(() => SubCategory, subCategory => subCategory.category)
  subCategories: SubCategory[]
}
