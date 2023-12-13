import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { GraphQLModule } from '@nestjs/graphql'
import { HttpStatus, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import * as dotenv from 'dotenv'
import { join } from 'path'

import { AdminModule } from '@app/admin'
import { AwsS3ClientModule } from '@app/aws-s3-client'
import { CategoryModule } from '@app/category'
import { CustomerUserModule } from '@app/customer-user'
import { dataSourceOptions } from 'db/data-source'
import EnvConfig from './config/config'
import { EventModule } from '@app/events'

dotenv.config()

const env = `${process.env.NODE_ENV}`

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${env}`, '.env'],
      load: [EnvConfig],
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: env !== 'prod',
      introspection: env !== 'prod',
      sortSchema: true,
      formatError: (error: GraphQLError | any) => {
        const graphQLFormattedError: GraphQLFormattedError & {
          statusCode: HttpStatus
        } = {
          statusCode:
            error?.extensions?.originalError?.statusCode ||
            error?.extensions?.code ||
            HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            error?.extensions?.originalError?.message || error?.message || 'Something went wrong'
        }
        return graphQLFormattedError
      }
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AdminModule,
    CustomerUserModule,
    CategoryModule,
    EventModule,
    AwsS3ClientModule
  ]
})
export class AppModule {}
