import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { CustomBaseEntity, SocialProvider } from '@app/common/entities'

@Entity({ name: 'customer_user' })
@Index(['email'])
@ObjectType()
export class Customer extends CustomBaseEntity {
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

  @Column({ length: 50, name: 'city', nullable: true })
  @Field(() => String, { nullable: true })
  city?: string

  @Column({ length: 50, name: 'country', nullable: true })
  @Field(() => String, { nullable: true })
  country?: string

  @Column({ length: 50, name: 'job_title', nullable: true })
  @Field(() => String, { nullable: true })
  jobTitle?: string

  @Column({ length: 50, name: 'company_name', nullable: true })
  @Field(() => String, { nullable: true })
  companyName?: string

  @Column({ length: 20, name: 'home_phone', nullable: true })
  @Field(() => String, { nullable: true })
  homePhone?: string

  @Column({ length: 20, name: 'cell_phone', nullable: true })
  @Field(() => String, { nullable: true })
  cellPhone?: string

  @Column({ name: 'first_address', nullable: true })
  @Field(() => String, { nullable: true })
  firstAddress?: string

  @Column({ name: 'second_address', nullable: true })
  @Field(() => String, { nullable: true })
  secondAddress?: string

  @Column({ length: 200, nullable: true, name: 'stripe_customer_id', unique: true })
  @Field(() => String, { nullable: true })
  stripeCustomerId?: string

  @Column({ length: 50, name: 'state', nullable: true })
  @Field(() => String, { nullable: true })
  state?: string

  @Column({ name: 'website', nullable: true })
  @Field(() => String, { nullable: true })
  website?: string

  @Column({ length: 50, name: 'zip_code', nullable: true })
  @Field(() => String, { nullable: true })
  zipCode?: string

  @Column({ nullable: true, default: false, name: 'is_active' })
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean

  // Enums

  // Relations

  @Field(() => SocialProvider, { nullable: true })
  @OneToOne(() => SocialProvider, socialProvider => socialProvider.customer, {
    nullable: true
  })
  socialProvider?: SocialProvider
}
