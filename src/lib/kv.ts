import Redis from 'ioredis'
import type { Article } from './types'

let client: Redis | null = null

function getRedis(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL
    if (!url) throw new Error('REDIS_URL is not configured')
    client = new Redis(url, { maxRetriesPerRequest: 3 })
  }
  return client
}

export async function saveArticle(article: Article): Promise<void> {
  await getRedis().set(`article:${article.id}`, JSON.stringify(article))
}

export async function getArticleById(id: string): Promise<Article | null> {
  const data = await getRedis().get(`article:${id}`)
  if (!data) return null
  return JSON.parse(data) as Article
}
