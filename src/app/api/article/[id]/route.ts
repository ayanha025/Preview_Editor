import { NextRequest, NextResponse } from 'next/server'
import { getArticleById, saveArticle } from '@/lib/kv'
import type { ApproveArticleBody } from '@/lib/types'

type RouteContext = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const article = await getArticleById(params.id)
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }
  return NextResponse.json(article)
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const article = await getArticleById(params.id)
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  const body: ApproveArticleBody = await req.json()

  const updated = {
    ...article,
    html: body.html,
    status: 'approved' as const,
    approvedAt: new Date().toISOString(),
  }

  await saveArticle(updated)
  return NextResponse.json(updated)
}
