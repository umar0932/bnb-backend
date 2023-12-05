import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'

import { Category } from './category.entity'

@Entity({ name: 'sub_category' })
@ObjectType()
export class SubCategory extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  idSubCategory!: number

  @Column({ length: 50, name: 'sub_category_name', unique: true })
  @Field()
  subCategoryName!: string

  @ManyToOne(() => Category, category => category.subCategories)
  @JoinColumn({ name: 'category_id' })
  @Field(() => Category, { nullable: true })
  category: Category
}
