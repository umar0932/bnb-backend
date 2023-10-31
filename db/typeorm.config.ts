import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'

import * as dotenv from 'dotenv'
import { join } from 'path'

const env = `${process.env.APP_ENV}`

dotenv.config({
  path: join(__dirname, `../.env.${env}`)
})

const configService = new ConfigService()

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  synchronize: configService.get('APP_ENV') === 'dev' ? true : false,
  logging: configService.get('APP_ENV') === 'dev' ? true : false,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  ssl: configService.get('APP_ENV') === 'prod' ? { rejectUnauthorized: false } : false
})
