import express from 'express'
import { Server } from 'http'
import cors from 'cors'
import IoRedis from 'ioredis'
import { config } from './config'
import { decode, encode } from './logic'

async function main() {
  const redisClient = new IoRedis({
    host: config.redis.host,
    port: config.redis.port,
  })

  const app = express()

  app.use(express.json())
  app.use(cors())

  app.post<string, {}, { shortUrl: string }, { longUrl: string }>('/encode', async (req, res) => {
    const { longUrl } = req.body

    const shortUrl = await encode({ longUrl, redisClient })

    console.log('/encode', { providedLongUrl: longUrl, shortUrl })

    res.send({ shortUrl })
  })

  app.post<string, {}, { longUrl: string } | { error: string }, { shortUrl: string }>('/decode', async (req, res) => {
    const { shortUrl } = req.body

    const longUrl = await decode({ shortUrl, redisClient })

    console.log('/decode', { providedShortUrl: shortUrl, longUrl })

    if (longUrl) {
      res.send({ longUrl })
    } else {
      res.status(404).send({ error: `short-url: ${shortUrl} not found` })
    }
  })

  const server = await new Promise<Server>(resolve => {
    const server = app.listen(config.servicePort, () => resolve(server))
  })

  const address = server.address()
  console.log(`service listening on`, typeof address === 'string' ? address : address?.port)
}

if (require.main === module) {
  main()
}
