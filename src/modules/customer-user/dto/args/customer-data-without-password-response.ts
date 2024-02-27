import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class CustomerWithoutPasswordResponse {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => String, { nullable: true })
  homePhone?: string

  @Field(() => String, { nullable: true })
  cellPhone?: string

  @Field(() => String, { nullable: true })
  jobTitle?: string

  @Field(() => String, { nullable: true })
  companyName?: string

  @Field(() => String, { nullable: true })
  website?: string

  @Field(() => String, { nullable: true })
  firstAddress?: string

  @Field(() => String, { nullable: true })
  secondAddress?: string

  @Field(() => String, { nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  country?: string

  @Field(() => String, { nullable: true })
  zipCode?: string

  @Field(() => String, { nullable: true })
  state?: string

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean
}
