import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

// lightweight inline cva to avoid extra dependency
function simpleCva(base: string, variants: Record<string, Record<string, string>>) {
  return (opts?: Record<string, string>) => cn(
    base,
    ...Object.entries(variants).map(([k, v]) => v[opts?.[k] || 'default'] ?? '')
  )
}

const buttonVariants = simpleCva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white",
  {
    variant: {
      default: "bg-black text-white hover:bg-black/90",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline: "border border-gray-300 bg-white hover:bg-gray-50",
      ghost: "hover:bg-gray-100"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "h-10 w-10"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default'|'secondary'|'outline'|'ghost'
  size?: 'default'|'sm'|'lg'|'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant='default', size='default', asChild=false, ...props }, ref) => {
    const Comp = asChild ? (Slot as any) : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { buttonVariants }
