import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white shadow hover:bg-primary-700",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-primary-300 bg-white text-primary-700 shadow-sm hover:bg-primary-50 hover:text-primary-800",
        secondary:
          "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-primary-600 underline-offset-4 hover:underline",
        // New color variants
        success:
          "bg-green-600 text-white shadow-sm hover:bg-green-700",
        warning:
          "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600",
        info:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
        purple:
          "bg-purple-600 text-white shadow-sm hover:bg-purple-700",
        orange:
          "bg-orange-600 text-white shadow-sm hover:bg-orange-700",
        teal:
          "bg-teal-600 text-white shadow-sm hover:bg-teal-700",
        // Outline variants with colors
        outlineSuccess:
          "border border-green-300 bg-white text-green-700 shadow-sm hover:bg-green-50 hover:text-green-800",
        outlineWarning:
          "border border-yellow-300 bg-white text-yellow-700 shadow-sm hover:bg-yellow-50 hover:text-yellow-800",
        outlineInfo:
          "border border-blue-300 bg-white text-blue-700 shadow-sm hover:bg-blue-50 hover:text-blue-800",
        outlinePurple:
          "border border-purple-300 bg-white text-purple-700 shadow-sm hover:bg-purple-50 hover:text-purple-800",
        outlineOrange:
          "border border-orange-300 bg-white text-orange-700 shadow-sm hover:bg-orange-50 hover:text-orange-800",
        outlineTeal:
          "border border-teal-300 bg-white text-teal-700 shadow-sm hover:bg-teal-50 hover:text-teal-800",
        // Soft variants (light backgrounds)
        softSuccess:
          "bg-green-100 text-green-800 shadow-sm hover:bg-green-200",
        softWarning:
          "bg-yellow-100 text-yellow-800 shadow-sm hover:bg-yellow-200",
        softInfo:
          "bg-blue-100 text-blue-800 shadow-sm hover:bg-blue-200",
        softPurple:
          "bg-purple-100 text-purple-800 shadow-sm hover:bg-purple-200",
        softOrange:
          "bg-orange-100 text-orange-800 shadow-sm hover:bg-orange-200",
        softTeal:
          "bg-teal-100 text-teal-800 shadow-sm hover:bg-teal-200",
        // Muted variants
        muted:
          "bg-gray-500 text-white shadow-sm hover:bg-gray-600",
        outlineMuted:
          "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
