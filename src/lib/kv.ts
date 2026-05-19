import { Redis } from '@upstash/redis'
import type { Article } from './types'

function createRedisClient(): Redis {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  }
  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL)
    return new Redis({ url: `https://${url.hostname}`, token: url.password })
  }
  throw new Error('No Redis configuration found. Set REDIS_URL or KV_REST_API_URL + KV_REST_API_TOKEN')
}

let client: Redis | null = null
function getRedis(): Redis {
  if (!client) client = createRedisClient()
  return client
}

export async function saveArticle(article: Article): Promise<void> {
  await getRedis().set(`article:${article.id}`, article)
}

export async function getArticleById(id: string): Promise<Article | null> {
  return getRedis().get<Article>(`article:${id}`)
}
