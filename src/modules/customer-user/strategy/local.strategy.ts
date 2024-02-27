import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { CustomerUserService } from '../customer-user.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'customer') {
  constructor(private customerUserService: CustomerUserService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    })
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.customerUserService.validateCustomer(email, password)

    if (!user) {
      throw new UnauthorizedException('Customer is invalid')
    }
    return user
  }
}
