import { describe, it, expect, vi } from 'vitest'
import { GET, PATCH } from '@/app/api/article/[id]/route'
import { NextRequest } from 'next/server'
import type { Article } from '@/lib/types'

const mockArticle: Article = {
  id: 'test-id-123',
  title: '테스트',
  html: '<article class="hunet_osmu_article ck-content"><p>본문</p></article>',
  status: 'draft',
  createdAt: '2026-05-19T00:00:00Z',
  approvedAt: null,
}

vi.mock('@/lib/kv', () => ({
  getArticleById: vi.fn(),
  saveArticle: vi.fn().mockResolvedValue(undefined),
}))

import { getArticleById, saveArticle } from '@/lib/kv'

describe('GET /api/article/[id]', () => {
  it('아티클을 반환한다', async () => {
    vi.mocked(getArticleById).mockResolvedValue(mockArticle)

    const req = new NextRequest('http://localhost/api/article/test-id-123')
    const res = await GET(req, { params: { id: 'test-id-123' } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.id).toBe('test-id-123')
    expect(data.status).toBe('draft')
  })

  it('존재하지 않는 id면 404 반환', async () => {
    vi.mocked(getArticleById).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/article/no-such-id')
    const res = await GET(req, { params: { id: 'no-such-id' } })

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/article/[id]', () => {
  it('html과 status를 approved로 업데이트한다', async () => {
    vi.mocked(getArticleById).mockResolvedValue(mockArticle)

    const updatedHtml = '<article class="hunet_osmu_article ck-content"><p>수정된 본문</p></article>'
    const req = new NextRequest('http://localhost/api/article/test-id-123', {
      method: 'PATCH',
      body: JSON.stringify({ html: updatedHtml }),
    })

    const res = await PATCH(req, { params: { id: 'test-id-123' } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.status).toBe('approved')
    expect(data.html).toBe(updatedHtml)
    expect(data.approvedAt).not.toBeNull()
    expect(vi.mocked(saveArticle)).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'approved', html: updatedHtml })
    )
  })

  it('존재하지 않는 id면 404 반환', async () => {
    vi.mocked(getArticleById).mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/article/no-such-id', {
      method: 'PATCH',
      body: JSON.stringify({ html: '<article/>' }),
    })

    const res = await PATCH(req, { params: { id: 'no-such-id' } })
    expect(res.status).toBe(404)
  })
})
