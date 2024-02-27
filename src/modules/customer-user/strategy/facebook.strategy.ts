import { ConfigType } from '@nestjs/config'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import * as Strategy from 'passport-facebook-token'
import { Profile } from 'passport'

import { AuthTypes } from '@app/common'
import facebookConfig from '@config/facebook.config'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, AuthTypes.FACEBOOK) {
  constructor(
    @Inject(facebookConfig.KEY)
    private facebookConf: ConfigType<typeof facebookConfig>
  ) {
    super({
      clientID: facebookConf.clientID,
      clientSecret: facebookConf.clientSecret
    })
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
    if (!profile) return done(new UnauthorizedException('Profile is invalid'), false)

    return done(null, profile)
  }
}
