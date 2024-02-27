import { Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ObjectType()
export class S3SignedUrlResponse {
  @IsString()
  @Field(() => String)
  signedUrl!: string

  @IsString()
  @Field(() => String)
  fileName!: string
}
