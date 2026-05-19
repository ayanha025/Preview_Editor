import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '아티클 프리뷰 에디터',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
