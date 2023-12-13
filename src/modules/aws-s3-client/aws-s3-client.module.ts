import { Module } from '@nestjs/common'
import { AwsS3ClientService } from './aws-s3-client.service'

@Module({
  providers: [AwsS3ClientService],
  exports: [AwsS3ClientService]
})
export class AwsS3ClientModule {}
