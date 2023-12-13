import { Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ObjectType()
export class S3SignedUrlResponse {
  @IsString()
  @Field()
  signedUrl!: string

  @IsString()
  @Field()
  fileName!: string
}
