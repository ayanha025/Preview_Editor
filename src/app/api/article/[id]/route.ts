import { NextRequest, NextResponse } from 'next/server'
import { getArticleById, saveArticle } from '@/lib/kv'
import type { ApproveArticleBody } from '@/lib/types'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const article = await getArticleById(id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json(article)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const article = await getArticleById(id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const body: ApproveArticleBody = await req.json()

    if (typeof body.html !== 'string') {
      return NextResponse.json({ error: 'html is required' }, { status: 400 })
    }

    const updated = {
      ...article,
      html: body.html,
      status: 'approved' as const,
      approvedAt: new Date().toISOString(),
    }

    await saveArticle(updated)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
