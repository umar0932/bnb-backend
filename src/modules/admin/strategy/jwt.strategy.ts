import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { JWT_STRATEGY_NAME, JwtDto } from '@app/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtAdmin') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.admin.secret')
    })
  }

  async validate(payload: JwtDto) {
    return {
      userId: payload.sub,
      email: payload.email,
      type: JWT_STRATEGY_NAME.ADMIN
    }
  }
}
