import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { saveArticle } from '@/lib/kv'
import type { Article, CreateArticleBody } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body: CreateArticleBody = await req.json()

  if (!body.title || !body.html) {
    return NextResponse.json(
      { error: 'title and html are required' },
      { status: 400 }
    )
  }

  const article: Article = {
    id: uuidv4(),
    title: body.title,
    html: body.html,
    status: 'draft',
    confluencePageId: body.confluencePageId,
    createdAt: new Date().toISOString(),
    approvedAt: null,
  }

  try {
    await saveArticle(article)
  } catch (error) {
    console.error('Failed to save article:', error)
    return NextResponse.json(
      { error: 'Failed to save article' },
      { status: 500 }
    )
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')

  return NextResponse.json(
    { id: article.id, editorUrl: `${baseUrl}/editor/${article.id}` },
    { status: 201 }
  )
}
