"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full transition-all duration-normal ease-out",
  {
    variants: {
      size: {
        sm: "h-10 w-10 sm:h-8 sm:w-8",      // 40px mobile, 32px desktop
        md: "h-12 w-12 sm:h-9 sm:w-9",      // 48px mobile, 36px desktop - responsive default
        lg: "h-16 w-16 sm:h-14 sm:w-14",    // 64px mobile, 56px desktop
        xl: "h-20 w-20 sm:h-18 sm:w-18",    // 80px mobile, 72px desktop
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const avatarImageVariants = cva(
  "aspect-square h-full w-full object-cover transition-opacity duration-normal",
  {
    variants: {
      loading: {
        true: "opacity-0",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      loading: false,
    },
  }
)

const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center bg-bg-brand text-text-inverse font-semibold select-none",
  {
    variants: {
      size: {
        sm: "text-sm",      // 14px
        md: "text-base",    // 16px
        lg: "text-lg",      // 18px
        xl: "text-xl",      // 20px
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
  VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, onLoadingStatusChange, ...props }, ref) => {
  const [loading, setLoading] = React.useState(true)

  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn(avatarImageVariants({ loading }), className)}
      onLoadingStatusChange={(status) => {
        setLoading(status === "loading")
        onLoadingStatusChange?.(status)
      }}
      {...props}
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
  VariantProps<typeof avatarFallbackVariants> {
  delayMs?: number
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, size, children, delayMs, ...props }, ref) => {
  // Extract initials from children if it's a string
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/)
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }

  const displayContent = React.useMemo(() => {
    if (typeof children === 'string') {
      return getInitials(children)
    }
    return children
  }, [children])

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(avatarFallbackVariants({ size }), className)}
      delayMs={delayMs}
      {...props}
    >
      {displayContent}
    </AvatarPrimitive.Fallback>
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }