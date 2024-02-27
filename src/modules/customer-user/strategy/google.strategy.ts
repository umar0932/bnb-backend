import { ConfigType } from '@nestjs/config'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Profile } from 'passport'
import { Strategy } from 'passport-google-token'

import { AuthTypes } from '@app/common'
import googleConfig from '@config/google.config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, AuthTypes.GOOGLE) {
  constructor(
    @Inject(googleConfig.KEY)
    private googleConf: ConfigType<typeof googleConfig>
  ) {
    super({
      clientID: googleConf.clientID,
      clientSecret: googleConf.clientSecret
    })
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
    if (!profile) return done(new UnauthorizedException('Profile is invalid'), false)
    return done(null, profile)
  }
}
