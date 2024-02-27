import { registerAs } from '@nestjs/config'

export default registerAs('facebook', () => ({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_SECRET
}))
