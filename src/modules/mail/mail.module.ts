import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MailController } from './mail.controller'
import { MailService } from './mail.service'
import { MailResolver } from './mail.resolver'

@Module({
  controllers: [MailController],
  imports: [ConfigModule],
  providers: [MailResolver, MailService],
  exports: [MailService]
})
export class MailModule {}
