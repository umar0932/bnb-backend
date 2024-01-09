import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class EventFilterInput {
  @Field({ nullable: true })
  eventTitle?: string

  @Field({ nullable: true })
  search?: string

  @Field({ nullable: true })
  categoryName?: string

  @Field({ nullable: true })
  online?: boolean

  @Field({ nullable: true })
  eventToday?: string

  @Field({ nullable: true })
  eventWeekend?: string
}
