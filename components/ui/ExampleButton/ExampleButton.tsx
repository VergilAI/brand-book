import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const examplebuttonVariants = cva(
  'base-styles-here',
  {
    variants: {
      variant: {
        default: 'default-styles',
        secondary: 'secondary-styles',
      },
      size: {
        sm: 'size-sm',
        md: 'size-md',
        lg: 'size-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ExampleButtonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof examplebuttonVariants> {
  /**
   * Component description
   */
  children?: React.ReactNode;
}

/**
 * ExampleButton component
 * 
 * @example
 * <ExampleButton variant="default" size="md">
 *   Content
 * </ExampleButton>
 */
export const ExampleButton = React.forwardRef<HTMLDivElement, ExampleButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(examplebuttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ExampleButton.displayName = 'ExampleButton';
