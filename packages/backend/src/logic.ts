import { Redis } from 'ioredis'
import cryptoRandomString from 'crypto-random-string'
import { config } from './config'
import { LongtUrl, ShortUrl } from './types'

/**
 * this function encode a longUrl to shortUrl.
 * it tries to solve the following problems:
 * 1. race-conditions: same/multiple services tries to save different long-urls to the same short-url.
 *    solution: we do not allow overriding value of existing short-url
 * 2. performance: 3 calls to redis
 *    solution: 2 of them are used in 'multi' to run multiple commands in one request to redis.
 * 3. same long-url is encoded multiple times.
 * solution: we first check if long-url is already encoded. if yes, we return the short-url from
 *           redis (instead of the new calculated short-url)
 *
 * Edge cases:
 * 1. if long-url was already encoded -> return the short-url from redis
 * 2. if short-url is already taken -> try again
 * @returns short-url
 */
export async function encode({ longUrl, redisClient }: { longUrl: string; redisClient: Redis }): Promise<ShortUrl> {
  let retry = config.encodeReties

  while (retry >= 0) {
    const hash = cryptoRandomString({ length: 10, type: 'url-safe' }).toLowerCase()
    const shortUrl = new URL(hash, config.baseShortUrl).href

    const [alreadyMatchedShortUrl, shortToLongResult] = await redisClient
      // all following commands will run atomically in a MULTI/EXEC transaction
      .multi()
      // return already matched shortUrl if exist
      .get(longUrl)
      // 'ex' -> set expiration time in seconds
      // 'nx' -> do not allow to set if short-url key already exists
      .set(shortUrl, longUrl, 'ex', config.redis.ttlSeconds, 'nx')
      .exec()

    if (alreadyMatchedShortUrl[1]) {
      return alreadyMatchedShortUrl[1]
    }

    if (shortToLongResult[1] === 'OK') {
      // this line is safe because there can't be 2 different long-urls that points to same short-url because
      // if yes, this line will throw error: `.set(shortUrl, longUrl, 'ex', config.redis.ttlSeconds, 'nx')`
      // because of the 'nx' option.
      await redisClient.set(longUrl, shortUrl, 'ex', config.redis.ttlSeconds)
      return shortUrl
    }

    // throw if redis failed not about duplicate short-url
    if (shortToLongResult[0]?.name !== 'NX') {
      // unknown error
      throw shortToLongResult[1]
    }

    retry--
  }

  throw new Error(`failed to generate short url for longUrl: ${longUrl} due to too many retries`)
}

export async function decode({
  shortUrl,
  redisClient,
}: {
  shortUrl: string
  redisClient: Redis
}): Promise<LongtUrl | null> {
  return redisClient.get(shortUrl)
}
