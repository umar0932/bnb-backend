import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class OrganizerEventFilterInput {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Boolean, { nullable: true })
  pastEvents?: boolean

  @Field(() => Boolean, { nullable: true })
  upcomingEvents?: boolean
}
