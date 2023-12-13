import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'

@Entity({ name: 'admin_user' })
@ObjectType()
export class Admin extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  idAdminUser!: string

  @Column({ length: 50, unique: true })
  @Field()
  email!: string

  @Column({ length: 50, name: 'first_name' })
  @Field()
  firstName!: string

  @Column({ length: 50, name: 'last_name' })
  @Field()
  lastName!: string

  @Column({ name: 'password' })
  @Field()
  password!: string

  @Field(() => String, { nullable: true })
  @Column({ length: 250, nullable: true })
  mediaUrl?: string

  @Column({ nullable: true, default: true, name: 'is_active' })
  @Field({ nullable: true })
  isActive?: boolean
}
