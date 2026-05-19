// src/lib/types.ts
export type ArticleStatus = 'draft' | 'approved'

export interface Article {
  id: string
  title: string
  html: string
  status: ArticleStatus
  confluencePageId?: string
  createdAt: string
  approvedAt: string | null
}

export interface CreateArticleBody {
  title: string
  html: string
  confluencePageId?: string
}

export interface ApproveArticleBody {
  html: string
}
