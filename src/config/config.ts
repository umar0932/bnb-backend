export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432', 10)
  },
  jwt: {
    customer: {
      secret: process.env.JWT_KEY_CUSTOMER,
      signOptions: { expiresIn: process.env.JWT_KEY_CUSTOMER_EXPIRY }
    },
    admin: {
      secret: process.env.JWT_KEY_ADMIN,
      signOptions: { expiresIn: process.env.JWT_KEY_ADMIN_EXPIRY }
    }
  },
  stripeConfig: {
    apiKey: process.env.STRIPE_SECRET_KEY,
    webhookConfig: {
      requestBodyProperty: 'rawBody',
      stripeSecrets: {
        account: process.env.STRIPE_WEBHOOK_SECRET
      }
    }
  },
  stripe: {
    publish: process.env.STRIPE_PUBLISH_KEY,
    currency: process.env.STRIPE_CURRENCY
  }
})
