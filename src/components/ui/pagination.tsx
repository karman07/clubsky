import { Button } from '@/components/ui/button'

type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (p: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-gray-500">
        Page <span className="font-medium text-gray-900">{page}</span> of {totalPages} • {total} items
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>Previous</Button>
        <Button variant="outline" disabled={!canNext} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  )
}
