import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './strategies/jwt.strategy'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { LocalStrategy } from './strategies/local.strategy'
import { RolesGuard } from './guards/roles.guard'

import { UsersModule } from '@app/users/users.module'

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      signOptions: { expiresIn: '3h' },
      secret: 'secret'
    })
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy, RolesGuard]
})
export class AuthModule {}
