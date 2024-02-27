import { Field, ObjectType } from '@nestjs/graphql'

import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@ObjectType()
export abstract class CustomBaseEntity {
  @Column({ length: 50, type: 'varchar', default: 'system', name: 'created_by' })
  @Field(() => String, { nullable: true })
  createdBy?: string

  @Column({
    length: 50,
    nullable: true,
    default: 'system',
    name: 'updated_by'
  })
  @Field(() => String, { nullable: true })
  updatedBy?: string

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  @Field({ nullable: true })
  createdDate?: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  @Field({ nullable: true })
  updatedDate?: Date
}
