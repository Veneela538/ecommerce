import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const headingVariants = cva("scroll-m-20 tracking-tight", {
  variants: {
    variant: {
      h6: "text-sm font-semibold",
      h5: "text-base font-semibold",
      h4: "text-lg font-semibold",
      h3: "text-xl font-semibold",
      h2: "text-2xl font-semibold",
      h1: "text-4xl font-extrabold lg:text-5xl",
    },
    isTruncated: {
      true: "truncate",
    },
  },
  defaultVariants: {
    variant: "h6",
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean
  isTruncated?: boolean
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    { className, variant, isTruncated = false, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : (variant ?? "h6")
    return (
      <Comp
        className={cn(headingVariants({ variant, isTruncated, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }
