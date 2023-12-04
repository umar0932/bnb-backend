// import { ObjectType, Field, ID } from '@nestjs/graphql'

// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

// import { CustomBaseEntity } from '@app/common/entities/base.entity'

// @Entity({ name: 'event' })
// @ObjectType()
// export class Event extends CustomBaseEntity {
//   @Field(() => ID)
//   @PrimaryGeneratedColumn('uuid')
//   idEvent!: string

//   @Column({ length: 50, name: 'event_title', unique: true })
//   @Field()
//   eventTitle!: string

//   @Column({ length: 50, name: 'first_name' })
//   @Field()
//   organizer!: string

//   @Column({ length: 50, name: 'last_name' })
//   @Field()
//   type!: string

//   @Column({ name: 'password' })
//   @Field()
//   Category!: string

//   @Column({ nullable: true, default: true, name: 'is_active' })
//   @Field({ nullable: true })
//   tags?: boolean

//   @Column({ nullable: true, default: true, name: 'is_active' })
//   @Field({ nullable: true })
//   Location?: boolean

//   @Column({ nullable: true, default: true, name: 'is_active' })
//   @Field({ nullable: true })
//   display?: boolean
// }
