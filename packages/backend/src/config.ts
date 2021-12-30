export type Config = {
  redis: {
    host: string
    port: number
  }
}

export const config: Config = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
}
