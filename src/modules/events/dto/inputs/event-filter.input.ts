import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class EventFilterInput {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => String, { nullable: true })
  categoryName?: string

  @Field(() => Boolean, { nullable: true })
  online?: boolean

  @Field(() => String, { nullable: true })
  eventToday?: string

  @Field(() => String, { nullable: true })
  eventWeekend?: string
}
