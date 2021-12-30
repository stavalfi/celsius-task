import express from 'express'
import { Server } from 'http'
import cors from 'cors'
import { config } from './config'

async function main() {
  const app = express()

  app.use(express.json())
  app.use(cors())

  app.post<string, {}, { shortUrl: string }, { longUrl: string }>('/encode', async (req, res) => {
    const { longUrl } = req.body
    console.log('longUrl', longUrl)
    res.send({ shortUrl: 'aa' })
  })

  app.get<string, { shortUrl: string }, { longUrl: string }>('/decode/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params
    console.log('shortUrl', shortUrl)
    res.send({ longUrl: 'sssssssssss' })
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
