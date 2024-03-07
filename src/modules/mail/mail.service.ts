import { ConfigService } from '@nestjs/config'
import { Injectable, Logger } from '@nestjs/common'

import * as nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

import { Configuration } from '@config/configuration.interface'

import { SendEmailInput } from './dto/inputs/send-email.input'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private config
  private transporter: Mail
  private app = 'Bnb web'

  constructor(private configService: ConfigService) {}

  // Private Methods

  // Public Methods

  mailTransport() {
    this.config = this.configService.get<Configuration['email']>('email')

    this.transporter = nodemailer.createTransport(this.config.transport)

    return this.transporter
  }

  async sendEmail({ recipients, subject, html }: SendEmailInput) {
    const transport = this.mailTransport()

    const options: Mail.Options = {
      from: this.config.transport?.from,
      to: recipients,
      subject,
      html
    }

    try {
      const result = await transport.sendMail(options)

      return result
    } catch (error) {}
  }

  async sendForgotPasswordEmail(recipients: string, name: string, code: string): Promise<void> {
    const subject = 'OTP Verification'
    const html = `
        <p>Hi ${name},</p>
        Thank you for using ${this.app}. To complete the verification of your account, please enter the following code:
        <strong>OTP Code: ${code}</strong>
        You can enter this code in the ${this.app} app to verify your account. If you have any problems or questions, please don't hesitate to reach out.
     
        Best regards,<br>
        The ${this.app} Team
    `
    await this.sendEmail({ recipients, subject, html })
  }
}
