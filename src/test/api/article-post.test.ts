import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/article/route'
import { NextRequest } from 'next/server'

vi.mock('@/lib/kv', () => ({
  saveArticle: vi.fn().mockResolvedValue(undefined),
}))

process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'

describe('POST /api/article', () => {
  it('아티클을 생성하고 id와 editorUrl을 반환한다', async () => {
    const req = new NextRequest('http://localhost/api/article', {
      method: 'POST',
      body: JSON.stringify({
        title: '테스트 아티클',
        html: '<article class="hunet_osmu_article ck-content"><p>본문</p></article>',
      }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.id).toBeDefined()
    expect(data.editorUrl).toBe(`http://localhost:3000/editor/${data.id}`)
  })

  it('title 없으면 400 반환', async () => {
    const req = new NextRequest('http://localhost/api/article', {
      method: 'POST',
      body: JSON.stringify({ html: '<article>...</article>' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('title and html are required')
  })

  it('html 없으면 400 반환', async () => {
    const req = new NextRequest('http://localhost/api/article', {
      method: 'POST',
      body: JSON.stringify({ title: '제목' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('title and html are required')
  })
})
