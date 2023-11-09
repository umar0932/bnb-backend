import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY')
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }
  }
}
