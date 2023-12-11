export interface DatabaseConfigTypes {
  host: string
  dbName: string
  user: string
  password: string
  port: number
}

export type PortConfig = string

interface JWTConfigType {
  secret: string
  signOptions: {
    expiresIn: string
  }
}

export interface JWTConfigTypes {
  customer?: JWTConfigType
  admin?: JWTConfigType
}
