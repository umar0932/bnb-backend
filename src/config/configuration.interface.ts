export interface Configuration {
  email: {
    name: string
    from: string
    retries?: number
    transport?: {
      host: string
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }
  }
}
