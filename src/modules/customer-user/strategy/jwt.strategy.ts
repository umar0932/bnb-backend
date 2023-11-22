import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { JWT_STRATEGY_NAME } from 'src/common/types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtCustomer') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.customer.secret')
    })
  }

  async validate(payload: { sub: string; email: string; type: string }) {
    return {
      userId: payload.sub,
      email: payload.email,
      type: JWT_STRATEGY_NAME.CUSTOMER
    }
  }
}
