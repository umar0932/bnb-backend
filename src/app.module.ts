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
import { UserModule } from './modules/users/user.module'

dotenv.config()

const env = `${process.env.APP_ENV}`

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
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/**/**.entity{.ts,.js}'],
          synchronize: configService.get('APP_ENV') === 'dev' ? true : false,
          migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
          migrationsTableName: 'migrations',
          logging: env === 'dev' ? true : false,
          ssl: env === 'prod' ? { rejectUnauthorized: false } : false
        } as TypeOrmModuleAsyncOptions
      }
    }),
    UserModule,
    AuthModule
  ],
  providers: [AppService, AppResolver]
})
export class AppModule {}
