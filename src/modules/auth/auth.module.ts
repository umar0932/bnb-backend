import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './strategies/jwt.strategy'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { ConfigService } from '@nestjs/config'
import { LocalStrategy } from './strategies/local.strategy'
import { RolesGuard } from './guards/roles.guard'

import { UserModule } from '@app/users/user.module'

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secretOrKey: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '2h' }
      })
    })
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy, RolesGuard]
})
export class AuthModule {}
