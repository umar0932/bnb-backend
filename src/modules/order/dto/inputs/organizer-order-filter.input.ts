import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class OrganizerOrderFilterInput {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  search?: string

  @Field(() => Boolean, { nullable: true })
  pastOneMonth?: boolean

  @Field(() => Boolean, { nullable: true })
  pastTwoMonths?: boolean

  @Field(() => Boolean, { nullable: true })
  pastThreeMonths?: boolean
}
