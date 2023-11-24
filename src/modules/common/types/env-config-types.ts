export type DatabaseConfigTypes = {
  host: string
  dbName: string
  user: string
  password: string
  port: number
}

export type PortConfig = string

type JWTConfigType = {
  secret: string
  signOptions: {
    expiresIn: string
  }
}

export type JWTConfigTypes = {
  customer?: JWTConfigType
  admin?: JWTConfigType
}
