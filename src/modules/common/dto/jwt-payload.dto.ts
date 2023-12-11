import { JWT_STRATEGY_NAME } from '../types'

export interface JwtDto {
  sub: string
  email: string
  type: JWT_STRATEGY_NAME
}
