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

  @Field(() => Boolean, { nullable: true })
  onSite?: boolean

  @Field(() => Boolean, { nullable: true })
  eventToday?: boolean

  @Field(() => Boolean, { nullable: true })
  eventTomorrow?: boolean

  @Field(() => Boolean, { nullable: true })
  eventWeekend?: boolean
}
