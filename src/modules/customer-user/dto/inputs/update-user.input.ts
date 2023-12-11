import { InputType, Field } from '@nestjs/graphql'

import { IsUrl, IsString, IsOptional } from 'class-validator'

@InputType()
export class UpdateCustomerInput {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  firstName?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  lastName?: string

  @IsOptional()
  @Field(() => String, { nullable: true })
  homePhone?: string

  @IsOptional()
  @Field(() => String, { nullable: true })
  cellPhone?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  JobTitle?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  companyName?: string

  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  website?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  firstAddress?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  secondAddress?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  city?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  country?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  zipCode?: string

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  state?: string

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  isActive?: boolean
}
