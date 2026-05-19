'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { EditorToolbar } from './EditorToolbar'
import { extractCmsHtml } from '@/lib/html'
import type { Article } from '@/lib/types'

interface ArticleEditorProps {
  article: Article
}

export function ArticleEditor({ article }: ArticleEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [editMode, setEditMode] = useState(false)
  const [isApproved, setIsApproved] = useState(article.status === 'approved')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = article.html
    }
  }, [article.html])

  useEffect(() => {
    if (!containerRef.current) return
    const editableSelectors = 'p, h2, h3, h4, h5, li, blockquote, td, span, strong'
    containerRef.current.querySelectorAll<HTMLElement>(editableSelectors).forEach(el => {
      if (editMode) {
        el.setAttribute('contenteditable', 'true')
      } else {
        el.removeAttribute('contenteditable')
      }
    })
    containerRef.current.setAttribute('data-edit-mode', String(editMode))
  }, [editMode])

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (!editMode) return
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement
      const newUrl = window.prompt('이미지 URL을 입력하세요:', img.src)
      if (newUrl && newUrl !== img.src) {
        img.src = newUrl
      }
    }
  }, [editMode])

  const getCurrentHtml = useCallback((): string => {
    if (!containerRef.current) return article.html
    return extractCmsHtml(containerRef.current.innerHTML)
  }, [article.html])

  const handleApprove = useCallback(async () => {
    const html = getCurrentHtml()
    const res = await fetch(`/api/article/${article.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    })
    if (res.ok) {
      setIsApproved(true)
      setEditMode(false)
    }
  }, [article.id, getCurrentHtml])

  const handleCopyHtml = useCallback(async () => {
    const html = getCurrentHtml()
    await navigator.clipboard.writeText(html)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [getCurrentHtml])

  return (
    <div>
      <EditorToolbar
        editMode={editMode}
        isApproved={isApproved}
        isCopied={isCopied}
        onToggleEdit={() => setEditMode(prev => !prev)}
        onApprove={handleApprove}
        onCopyHtml={handleCopyHtml}
      />
      <div className="py-10">
        <div id="article-container">
          <div ref={containerRef} onClick={handleContainerClick} />
        </div>
      </div>
    </div>
  )
}
