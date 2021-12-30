export type Config = {
  servicePort: number
  redis: {
    host: string
    port: number
    ttlSeconds: number
  }
  baseShortUrl: string
  encodeReties: number
}

export const config: Config = {
  servicePort: Number(process.env.SERVICE_PORT) || 8080,
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    ttlSeconds: Number(process.env.REDIS_TTL_SECONDS) || 60 * 60 * 24 * 30, // save for 1 months
  },
  baseShortUrl: process.env.BASE_SHORT_URL || 'https://short.url/',
  encodeReties: Number(process.env.ENCODE_RETRIES) || 10,
}
