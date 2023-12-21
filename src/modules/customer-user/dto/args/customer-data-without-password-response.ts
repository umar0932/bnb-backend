import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class CustomerWithoutPasswordResponse {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  homePhone?: string

  @Field({ nullable: true })
  cellPhone?: string

  @Field({ nullable: true })
  jobTitle?: string

  @Field({ nullable: true })
  companyName?: string

  @Field({ nullable: true })
  website?: string

  @Field({ nullable: true })
  firstAddress?: string

  @Field({ nullable: true })
  secondAddress?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  country?: string

  @Field({ nullable: true })
  zipCode?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  isActive?: boolean
}
