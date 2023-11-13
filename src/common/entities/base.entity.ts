import { Field, ID } from '@nestjs/graphql'
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

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
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  @Field()
  updatedAt: Date
}
