import { JWT_STRATEGY_NAME } from '../types'

export interface JwtDto {
  sub: string
  email: string
  firstName: string
  lastName: string
  profileImage?: string
  type: JWT_STRATEGY_NAME
}
