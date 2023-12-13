import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as AWS from 'aws-sdk'
import * as AWS3 from '@aws-sdk/client-s3'

@Injectable()
export class AwsS3ClientService {
  private client
  private aws
  constructor(private readonly configService: ConfigService) {
    this.initService()
  }

  private initService() {
    const region = this.configService.get('AWS_S3_REGION')
    const accessKeyId = this.configService.get('AWS_USER')
    const secretKey = this.configService.get('AWS_USER_PASSWORD')
    AWS.config.update({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey: secretKey
      }
    })

    this.aws = AWS
    this.client = new AWS3.S3Client({
      credentials: {
        secretAccessKey: secretKey,
        accessKeyId
      },
      region
    })
  }

  public getClient() {
    return this.client
  }
}
