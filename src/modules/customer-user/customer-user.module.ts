import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '@app/admin'
import { AwsS3ClientModule } from '@app/aws-s3-client'
import { JWTConfigTypes } from '@app/common'
import { PaymentModule } from '@app/payment'
import { SocialProvider } from '@app/common/entities'
import googleConfig from '@config/google.config'

import { Customer } from './entities/customer.entity'
import { CustomerUserResolver } from './customer-user.resolver'
import { CustomerUserService } from './customer-user.service'
import { GoogleStrategy, JwtStrategy, LocalStrategy } from './strategy'
import { Organizer } from './entities/organizer.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Organizer, SocialProvider]),
    ConfigModule.forFeature(googleConfig),
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
    }),
    AdminModule,
    AwsS3ClientModule,
    forwardRef(() => PaymentModule)
  ],
  providers: [
    CustomerUserResolver,
    CustomerUserService,
    GoogleStrategy,
    JwtStrategy,
    LocalStrategy
  ],
  exports: [CustomerUserService]
})
export class CustomerUserModule {}
