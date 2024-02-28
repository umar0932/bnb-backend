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
import facebookConfig from '@config/facebook.config'
import googleConfig from '@config/google.config'

import { Customer, CustomerFollower, Organizer } from './entities'
import { CustomerUserResolver } from './customer-user.resolver'
import { CustomerUserService } from './customer-user.service'
import { FacebookStrategy, GoogleStrategy, JwtStrategy, LocalStrategy } from './strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerFollower, Organizer, SocialProvider]),
    ConfigModule.forFeature(facebookConfig),
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
    FacebookStrategy,
    GoogleStrategy,
    JwtStrategy,
    LocalStrategy
  ],
  exports: [CustomerUserService]
})
export class CustomerUserModule {}
