import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm'

import { Customer } from '@app/customer-user/entities'

import { SocialProviderTypes } from '../types'

registerEnumType(SocialProviderTypes, {
  name: 'SocialAuthProviders',
  description: 'Social provider types'
})

@Entity('social_provider')
@ObjectType()
export class SocialProvider {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: SocialProviderTypes, name: 'social_provider' })
  @Field(() => SocialProviderTypes)
  provider: SocialProviderTypes

  @Column({ unique: true })
  @Field()
  socialId: string

  @Field(() => Customer)
  @OneToOne(() => Customer, customer => customer.socialProvider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ref_id_customer' })
  customer: Customer

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  @Field()
  createdDate: Date
}
