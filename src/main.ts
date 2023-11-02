import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
// import { ValidationExceptionFilter } from './exceptions/validation_exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })
  const configService = app.get(ConfigService)

  // app.useGlobalFilters(new ValidationExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  await app.listen(configService.get('APP_PORT'))
}
bootstrap()
