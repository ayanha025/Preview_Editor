import { kv } from '@vercel/kv'
import type { Article } from './types'

export async function saveArticle(article: Article): Promise<void> {
  await kv.set(`article:${article.id}`, article)
}

export async function getArticleById(id: string): Promise<Article | null> {
  return kv.get<Article>(`article:${id}`)
}
