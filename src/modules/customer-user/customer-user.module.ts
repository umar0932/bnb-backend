import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { JWTConfigTypes } from '@app/common'

import { Customer } from './entities/customer.entity'
import { CustomerUserResolver } from './customer-user.resolver'
import { CustomerUserService } from './customer-user.service'
import { JwtStrategy } from './strategy/jwt.strategy'
import { LocalStrategy } from './strategy/local.strategy'
import { Admin } from '@app/admin/entities/admin.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Admin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get<JWTConfigTypes>('jwt.customer', {
          infer: true
        })
        return { ...jwtConfig }
      },
      inject: [ConfigService]
    })
  ],
  providers: [CustomerUserResolver, CustomerUserService, JwtStrategy, LocalStrategy],
  exports: [CustomerUserService]
})
export class CustomerUserModule {}
