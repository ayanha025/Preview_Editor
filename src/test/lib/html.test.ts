import { describe, it, expect } from 'vitest'
import { extractCmsHtml } from '@/lib/html'

describe('extractCmsHtml', () => {
  it('contenteditable 속성을 제거한다', () => {
    const input = '<p contenteditable="true">텍스트</p><h2 contenteditable="true">제목</h2>'
    const result = extractCmsHtml(input)
    expect(result).not.toContain('contenteditable')
    expect(result).toContain('텍스트')
    expect(result).toContain('제목')
  })

  it('article 태그와 내부 구조를 유지한다', () => {
    const input = `<article class="hunet_osmu_article ck-content" contenteditable="true">
      <h2 class="title">소제목</h2>
      <p>본문 내용</p>
    </article>`
    const result = extractCmsHtml(input)
    expect(result).toContain('hunet_osmu_article ck-content')
    expect(result).toContain('<h2 class="title">소제목</h2>')
    expect(result).not.toContain('contenteditable')
  })

  it('script 태그를 제거한다', () => {
    const input = '<p>안전한 텍스트</p><script>alert("xss")</script>'
    const result = extractCmsHtml(input)
    expect(result).not.toContain('<script>')
    expect(result).toContain('안전한 텍스트')
  })
})
