import { Resolver } from '@nestjs/graphql'

import { MailService } from './mail.service'

@Resolver()
export class MailResolver {
  constructor(private readonly mailService: MailService) {}
}
