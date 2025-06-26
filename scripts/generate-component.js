#!/usr/bin/env node

/**
 * Component Generator CLI
 * Usage: npm run generate:component ComponentName -- --category=primitive
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const componentName = args[0];

if (!componentName) {
  console.error('❌ Please provide a component name');
  console.log('Usage: npm run generate:component ComponentName -- --category=primitive');
  process.exit(1);
}

// Parse options
const options = args.slice(1).reduce((acc, arg) => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    acc[key] = value || true;
  }
  return acc;
}, {});

const category = options.category || 'ui';
const validCategories = ['primitive', 'brand', 'pattern', 'ui', 'vergil', 'landing', 'lms', 'docs'];

if (!validCategories.includes(category)) {
  console.error(`❌ Invalid category: ${category}`);
  console.log(`Valid categories: ${validCategories.join(', ')}`);
  process.exit(1);
}

// Determine base path based on category
let basePath;
if (['primitive', 'brand', 'pattern'].includes(category)) {
  basePath = path.join('packages', 'design-system', category);
} else {
  basePath = path.join('components', category);
}

// Convert ComponentName to kebab-case for file names
const kebabCase = componentName
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .toLowerCase();

const componentDir = path.join(basePath, componentName);

// Create component directory
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

// Component template
const componentTemplate = `import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const ${componentName.toLowerCase()}Variants = cva(
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

export interface ${componentName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${componentName.toLowerCase()}Variants> {
  /**
   * Component description
   */
  children?: React.ReactNode;
}

/**
 * ${componentName} component
 * 
 * @example
 * <${componentName} variant="default" size="md">
 *   Content
 * </${componentName}>
 */
export const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${componentName.toLowerCase()}Variants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;

// Story template
const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta = {
  title: '${category === 'primitive' ? 'Primitives' : category === 'brand' ? 'Brand' : category === 'pattern' ? 'Patterns' : 'Components'}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '${componentName} content',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary variant',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small size',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large size',
  },
};
`;

// Test template
const testTemplate = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders children correctly', () => {
    render(<${componentName}>Test content</${componentName}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(
      <${componentName} variant="secondary">Content</${componentName}>
    );
    expect(container.firstChild).toHaveClass('secondary-styles');
  });

  it('applies size classes', () => {
    const { container } = render(
      <${componentName} size="lg">Content</${componentName}>
    );
    expect(container.firstChild).toHaveClass('size-lg');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<${componentName} ref={ref}>Content</${componentName}>);
    expect(ref.current).toBeInTheDocument();
  });
});
`;

// Index template
const indexTemplate = `export * from './${componentName}';
`;

// Write files
fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), componentTemplate);
fs.writeFileSync(path.join(componentDir, `${componentName}.stories.tsx`), storyTemplate);
fs.writeFileSync(path.join(componentDir, `${componentName}.test.tsx`), testTemplate);
fs.writeFileSync(path.join(componentDir, 'index.ts'), indexTemplate);

console.log(`✅ Component ${componentName} created successfully!`);
console.log(`📁 Location: ${componentDir}`);
console.log(`
📝 Files created:
  - ${componentName}.tsx
  - ${componentName}.stories.tsx
  - ${componentName}.test.tsx
  - index.ts
`);
console.log(`🚀 Next steps:
  1. Update the component implementation
  2. Run Storybook to see your component: npm run storybook
  3. Write tests for your component
`);