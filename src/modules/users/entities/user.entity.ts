import { ObjectType, Field, Int } from '@nestjs/graphql'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import Role from '@app/enums/roles.enum'

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column()
  @Field()
  email: string

  @Column()
  @Field()
  username: string

  @Column()
  @Field()
  password: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  @Field()
  role: Role
}
