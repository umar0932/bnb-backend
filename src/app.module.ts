import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'

import * as dotenv from 'dotenv'
import { join } from 'path'

import { AuthModule } from './modules/auth/auth.module'
import { AppService } from './app.service'
import { AppResolver } from './app.resolver'
import { UsersModule } from './modules/users/users.module'

dotenv.config()

const env = `${(process.env.NODE_ENV || 'development').toLowerCase()}`

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), `.env.${env}`),
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      definitions: {
        path: join(process.cwd(), 'src/graphql.schema.ts')
      },
      playground: true,
      sortSchema: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          name: 'default',
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/**.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNC'),
          logging: env === 'development' ? true : false,
          ssl: env === 'production' ? { rejectUnauthorized: false } : false
        } as TypeOrmModuleAsyncOptions
      }
    }),
    UsersModule,
    AuthModule
  ],
  providers: [AppService, AppResolver]
})
export class AppModule {}
