import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'

const logger = new Logger('App')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true
  })

  app.useLogger(logger)

  const configService = app.get(ConfigService)
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  await app.listen(configService.get<number>('APP_PORT', 4000))
}
bootstrap()
