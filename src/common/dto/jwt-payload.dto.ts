import { JWT_STRATEGY_NAME } from '../types/enum'

export interface JwtDto {
  sub: string
  username: string
  type: JWT_STRATEGY_NAME
}
