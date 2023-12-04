import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'

@Entity({ name: 'organizer_user' })
@ObjectType()
export class Organizer extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  idOrganizerUser!: string

  @Column({ length: 100, unique: true })
  @Field()
  name!: string

  @Column({ length: 500, name: 'website_link', nullable: true })
  @Field()
  websiteLink?: string

  @Column({ name: 'organization_bio', nullable: true })
  @Field()
  organizationBio?: string

  @Column({ length: 500, name: 'description', nullable: true })
  @Field()
  description?: string

  @Column({ nullable: true, default: true, name: 'is_active' })
  @Field({ nullable: true })
  isActive?: boolean
}
