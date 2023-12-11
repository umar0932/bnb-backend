import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { JWTConfigTypes } from '@app/common'

import { Admin } from './entities'
import { AdminResolver } from './admin.resolver'
import { AdminService } from './admin.service'
import { JwtStrategy, LocalStrategy } from './strategy'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Admin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get<JWTConfigTypes>('jwt.admin', {
          infer: true
        })
        return { ...jwtConfig }
      },
      inject: [ConfigService]
    })
  ],
  providers: [AdminResolver, AdminService, JwtStrategy, LocalStrategy],
  exports: [AdminService]
})
export class AdminModule {}
