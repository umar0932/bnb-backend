import { applyDecorators, UseGuards } from '@nestjs/common'
import { JWTGuard } from '../guard/jwt-guard'

export const Allow = () => {
  return applyDecorators(UseGuards(JWTGuard))
}
