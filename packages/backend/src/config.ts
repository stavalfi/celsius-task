export type Config = {
  servicePort: number
  redis: {
    host: string
    port: number
  }
}

export const config: Config = {
  servicePort: Number(process.env.SERVICE_PORT) || 8080,
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
}
