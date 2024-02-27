import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity } from '@app/common/entities/base.entity'

@Entity({ name: 'admin' })
@ObjectType()
export class Admin extends CustomBaseEntity {
  // Primary key
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Complusory Variables

  @Column({ length: 50, unique: true })
  @Field(() => String)
  email!: string

  @Column({ length: 50, name: 'first_name' })
  @Field(() => String)
  firstName!: string

  @Column({ length: 50, name: 'last_name' })
  @Field(() => String)
  lastName!: string

  @Column({ name: 'password' })
  @Field(() => String)
  password!: string

  // Non Complusory Variables

  @Column({ length: 250, name: 'profile_image', nullable: true })
  @Field(() => String, { nullable: true })
  profileImage?: string

  @Column({ nullable: true, default: false, name: 'is_active' })
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean
}
