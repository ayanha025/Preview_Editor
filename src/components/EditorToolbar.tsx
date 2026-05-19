'use client'

interface EditorToolbarProps {
  editMode: boolean
  isApproved: boolean
  isCopied: boolean
  onToggleEdit: () => void
  onApprove: () => Promise<void>
  onCopyHtml: () => void
}

export function EditorToolbar({
  editMode,
  isApproved,
  isCopied,
  onToggleEdit,
  onApprove,
  onCopyHtml,
}: EditorToolbarProps) {
  return (
    <div className="sticky top-0 z-50 flex items-center gap-3 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <button
        onClick={onToggleEdit}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          editMode
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {editMode ? '편집 모드 ON' : '편집 모드 OFF'}
      </button>

      <button
        onClick={onApprove}
        disabled={isApproved}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isApproved
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {isApproved ? '✓ 승인 완료됨' : '승인 완료'}
      </button>

      <button
        onClick={onCopyHtml}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isCopied
            ? 'bg-gray-100 text-gray-500'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isCopied ? '✓ 복사됨' : 'CMS HTML 복사'}
      </button>

      {isApproved && (
        <span className="ml-auto text-sm text-green-600 font-medium">
          검토 완료 — CMS에 붙여넣기 준비됨
        </span>
      )}
    </div>
  )
}
