import { Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ObjectType()
export class S3FileNameInput {
  @IsString()
  @Field(() => String)
  key!: string
}
