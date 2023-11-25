import { Field } from '@nestjs/graphql'
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class CustomBaseEntity {
  @Column({ length: 50, type: 'varchar', default: 'system', name: 'created_by' })
  createdBy = 'system'

  @Column({
    length: 50,
    nullable: true,
    default: 'system',
    name: 'updated_by'
  })
  updatedBy?: string

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  @Field()
  createdDate: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  @Field()
  updatedDate: Date
}
