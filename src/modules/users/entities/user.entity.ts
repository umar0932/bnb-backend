import { ObjectType, Field, ID } from '@nestjs/graphql'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional
} from 'class-validator'
import { Transform } from 'class-transformer'

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column({ unique: true })
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Column()
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string

  @Column()
  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string

  @Column()
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @Transform(value => value.toString())
  @IsPhoneNumber()
  homePhone: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @Transform(value => value.toString())
  @IsPhoneNumber()
  cellPhone: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  JobTitle: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  companyName: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  website: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  firstAddress: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  secondAddress: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  city: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  country: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  zipCode: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  state: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  isActive: string


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
