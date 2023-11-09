import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './strategies/jwt.strategy'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { LocalStrategy } from './strategies/local.strategy'
import { RolesGuard } from './guards/roles.guard'

import { UserModule } from '@app/users/user.module'

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_KEY_EXPIRY') }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy, RolesGuard]
})
export class AuthModule {}
