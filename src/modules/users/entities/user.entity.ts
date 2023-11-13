import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

import { Transform } from 'class-transformer'
import { CustomBaseEntity } from 'src/common/entities/base.entity'

@Entity()
@ObjectType()
export class User extends CustomBaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

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

  @Column({ length: 20, name: 'home_phone', nullable: true })
  @Field({ nullable: true })
  @Transform(value => value.toString())
  homePhone?: string

  @Column({ length: 20, name: 'cell_phone', nullable: true })
  @Field({ nullable: true })
  @Transform(value => value.toString())
  cellPhone?: string

  @Column({ length: 50, name: 'job_title', nullable: true })
  @Field({ nullable: true })
  JobTitle?: string

  @Column({ length: 50, name: 'company_name', nullable: true })
  @Field({ nullable: true })
  companyName?: string

  @Column({ name: 'website', nullable: true })
  @Field({ nullable: true })
  website?: string

  @Column({ name: 'first_address', nullable: true })
  @Field({ nullable: true })
  firstAddress?: string

  @Column({ name: 'second_address', nullable: true })
  @Field({ nullable: true })
  secondAddress?: string

  @Column({ length: 50, name: 'city', nullable: true })
  @Field({ nullable: true })
  city?: string

  @Column({ length: 50, name: 'country', nullable: true })
  @Field({ nullable: true })
  country?: string

  @Column({ length: 50, name: 'zip_code', nullable: true })
  @Field({ nullable: true })
  zipCode?: string

  @Column({ length: 50, name: 'state', nullable: true })
  @Field({ nullable: true })
  state?: string

  @Column({ nullable: true, default: false })
  @Field({ nullable: true })
  isActive: boolean

  // @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  // @Field()
  // created_at: Date

  // @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  // @Field()
  // updated_at: Date

  // @Column({
  //   type: 'enum',
  //   enum: Role,
  //   default: Role.ATTENDEE
  // })
  // @Field()
  // @IsEnum(Role)
  // role: Role
}
