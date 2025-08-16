import { cn } from '@/lib/utils'

export function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-gray-100 border-gray-200", className)}>
      {children}
    </span>
  )
}
