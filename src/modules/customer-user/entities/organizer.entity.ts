import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'

@Entity({ name: 'organizer_user' })
@ObjectType()
export class Organizer extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ length: 100, unique: true })
  @Field(() => String)
  name!: string

  // Non Complusory Variables

  @Column({ length: 500, name: 'website_link', nullable: true })
  @Field(() => String, { nullable: true })
  websiteLink?: string

  @Column({ name: 'organization_bio', nullable: true })
  @Field(() => String, { nullable: true })
  organizationBio?: string

  @Column({ length: 500, name: 'description', nullable: true })
  @Field(() => String, { nullable: true })
  description?: string

  @Column({ nullable: true, default: false, name: 'is_active' })
  @Field(() => String, { nullable: true })
  isActive?: boolean
}
