import { notFound } from 'next/navigation'
import { getArticleById } from '@/lib/kv'
import { ArticleEditor } from '@/components/ArticleEditor'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditorPage({ params }: PageProps) {
  const { id } = await params
  const article = await getArticleById(id)
  if (!article) notFound()

  return <ArticleEditor article={article} />
}
