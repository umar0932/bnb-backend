import { ConfigService } from '@nestjs/config'

import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
import { join } from 'path'

const env = `${process.env.NODE_ENV}`

dotenv.config({
  path: join(__dirname, `../../.env.${env}`)
})

const configService = new ConfigService()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [`dist/**/*.entity.js`],
  synchronize: configService.get('NODE_ENV') === 'dev' ? true : false,
  logging: configService.get('NODE_ENV') === 'dev' ? true : false,
  migrations: [`dist/db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  ssl: configService.get('NODE_ENV') === 'prod' ? { rejectUnauthorized: false } : false
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
