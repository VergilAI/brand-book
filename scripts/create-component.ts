#!/usr/bin/env node

/**
 * Vergil Design System Component Generator CLI
 * 
 * Creates components following the centralized token system and mandatory structure.
 * Enforces V2 token usage and generates complete component scaffolding.
 * 
 * Usage: npm run create:component ComponentName -- --category=ui
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Define valid categories with their paths and descriptions
const COMPONENT_CATEGORIES = {
  ui: {
    path: 'components/ui',
    description: 'Core UI components (Button, Card, Input, etc.)',
    examples: ['Button', 'Card', 'Input', 'Select', 'Modal']
  },
  vergil: {
    path: 'components/vergil',
    description: 'Brand-specific components (logos, patterns, visualizations)',
    examples: ['VergilLogo', 'RadialHeatmap', 'StreamgraphBackground']
  },
  landing: {
    path: 'components/landing',
    description: 'Landing page components (approved, do not modify)',
    examples: ['LearnHero', 'UserJourneyCarousel', 'Navigation']
  },
  lms: {
    path: 'components/lms',
    description: 'LMS-specific components (courses, games, admin)',
    examples: ['CourseCard', 'GameInterface', 'LessonViewer']
  },
  docs: {
    path: 'components/docs',
    description: 'Documentation components',
    examples: ['CodeBlock', 'ComponentPreview', 'DocsLayout']
  }
} as const;

type ComponentCategory = keyof typeof COMPONENT_CATEGORIES;

// V2 token imports and examples
const V2_TOKEN_IMPORTS = `
// ✅ V2 Token System - MANDATORY
// Brand Colors v2
'vergil-purple': Primary brand color
'vergil-off-black': Dark neutral
'vergil-off-white': Light neutral
'vergil-emphasis-bg': Subtle emphasis background
'vergil-emphasis-text': Subtle emphasis text
'vergil-emphasis-button-hover': Button hover state

// Functional Colors v2
'vergil-success': Success state
'vergil-error': Error state
'vergil-warning': Warning state
'vergil-info': Information state

// Typography Scale
'text-display-xl': Extra large display text
'text-h1': Heading 1
'text-body-md': Body medium
'text-caption': Small caption text

// Spacing Scale
'space-1': 0.25rem
'space-4': 1rem
'space-8': 2rem
'space-12': 3rem

// ❌ NEVER use arbitrary values like bg-[#6366F1] or text-[16px]
// ❌ NEVER use hardcoded Tailwind colors like bg-blue-500 or text-red-600
`.trim();

interface ComponentOptions {
  name: string;
  category: ComponentCategory;
  description?: string;
  hasVariants?: boolean;
  hasSizes?: boolean;
  isInteractive?: boolean;
}

class ComponentGenerator {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run(): Promise<void> {
    try {
      // Check for help flag
      if (process.argv.includes('--help') || process.argv.includes('-h')) {
        this.showHelp();
        return;
      }

      console.log('🚀 Vergil Design System Component Generator\n');
      
      const options = await this.gatherOptions();
      await this.validateOptions(options);
      await this.generateComponent(options);
      
      console.log('\n✅ Component created successfully!');
      console.log('🚀 Next steps:');
      console.log('  1. Review and customize the generated component');
      console.log('  2. Update styles using ONLY V2 tokens');
      console.log('  3. Run Storybook: npm run storybook');
      console.log('  4. Run tests: npm test');
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  private showHelp(): void {
    console.log(`
🚀 Vergil Design System Component Generator

Creates components following the centralized V2 token system and mandatory structure.

USAGE:
  npm run create:component <ComponentName> [options]

EXAMPLES:
  # Interactive mode
  npm run create:component MyButton

  # Non-interactive mode with all options
  npm run create:component MyButton -- --category=ui --variants=true --sizes=true --interactive=true

  # Simple component
  npm run create:component MyCard -- --category=ui --variants=true

  # Brand component
  npm run create:component MyVisualization -- --category=vergil

OPTIONS:
  --category=<string>     Component category (ui|vergil|landing|lms|docs)
  --variants=<boolean>    Include variant system (true|false)
  --sizes=<boolean>       Include size system (true|false)
  --interactive=<boolean> Interactive component with motion (true|false)
  --description=<string>  Component description
  --help, -h             Show this help message

CATEGORIES:
  ui       Core UI components (Button, Card, Input, etc.)
  vergil   Brand-specific components (logos, patterns, visualizations)
  landing  Landing page components (approved, create only if required)
  lms      LMS-specific components (courses, games, admin)
  docs     Documentation components

FEATURES:
  ✅ V2 Token System enforcement (no hardcoded values)
  ✅ Complete scaffolding (component, stories, tests, exports)
  ✅ Class Variance Authority integration
  ✅ Accessibility considerations
  ✅ TypeScript support
  ✅ Framer Motion integration (for interactive components)

For detailed documentation, see: /scripts/README-component-generator.md
`);
  }

  private async gatherOptions(): Promise<ComponentOptions> {
    // Parse command line arguments first
    const args = process.argv.slice(2);
    const componentName = args[0];
    
    if (!componentName) {
      throw new Error('Please provide a component name\nUsage: npm run create:component ComponentName -- --category=ui');
    }

    // Parse CLI options
    const cliOptions = args.slice(1).reduce((acc, arg) => {
      if (arg.startsWith('--')) {
        const [key, value] = arg.substring(2).split('=');
        acc[key] = value || true;
      }
      return acc;
    }, {} as Record<string, any>);

    // Validate component name
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
      throw new Error('Component name must start with uppercase letter and contain only letters and numbers');
    }

    // Get category (CLI or interactive)
    let category: ComponentCategory;
    if (cliOptions.category && COMPONENT_CATEGORIES[cliOptions.category as ComponentCategory]) {
      category = cliOptions.category as ComponentCategory;
    } else {
      category = await this.promptForCategory();
    }

    // Check if running in non-interactive mode (all options provided via CLI)
    const isNonInteractive = cliOptions.category && 
      (cliOptions.description !== undefined || cliOptions.variants !== undefined || 
       cliOptions.sizes !== undefined || cliOptions.interactive !== undefined);

    let description: string;
    let hasVariants: boolean;
    let hasSizes: boolean;
    let isInteractive: boolean;

    if (isNonInteractive) {
      // Use CLI options
      description = cliOptions.description || `${componentName} component`;
      hasVariants = cliOptions.variants === 'true' || cliOptions.variants === true;
      hasSizes = cliOptions.sizes === 'true' || cliOptions.sizes === true;
      isInteractive = cliOptions.interactive === 'true' || cliOptions.interactive === true;
    } else {
      // Get additional options interactively
      description = await this.prompt(`Description for ${componentName} (optional): `);
      hasVariants = await this.confirm('Include variant system (default/secondary/etc.)? (y/N): ');
      hasSizes = await this.confirm('Include size system (sm/md/lg)? (y/N): ');
      isInteractive = await this.confirm('Is this an interactive component? (y/N): ');
    }

    return {
      name: componentName,
      category,
      description: description || `${componentName} component`,
      hasVariants,
      hasSizes,
      isInteractive
    };
  }

  private async promptForCategory(): Promise<ComponentCategory> {
    console.log('\nAvailable categories:');
    Object.entries(COMPONENT_CATEGORIES).forEach(([key, config], index) => {
      console.log(`  ${index + 1}. ${key} - ${config.description}`);
      console.log(`     Examples: ${config.examples.join(', ')}`);
    });

    const answer = await this.prompt('\nSelect category (1-5): ');
    const categoryIndex = parseInt(answer) - 1;
    const categories = Object.keys(COMPONENT_CATEGORIES) as ComponentCategory[];
    
    if (categoryIndex < 0 || categoryIndex >= categories.length) {
      throw new Error('Invalid category selection');
    }

    return categories[categoryIndex];
  }

  private async validateOptions(options: ComponentOptions): Promise<void> {
    const { name, category } = options;
    const componentPath = path.join(
      process.cwd(),
      COMPONENT_CATEGORIES[category].path,
      name
    );

    if (fs.existsSync(componentPath)) {
      const overwrite = await this.confirm(`Component ${name} already exists. Overwrite? (y/N): `);
      if (!overwrite) {
        throw new Error('Component generation cancelled');
      }
    }

    // Check for special category restrictions
    if (category === 'landing') {
      console.log('⚠️  Warning: Landing components are fully approved. Only create if explicitly required.');
      const proceed = await this.confirm('Continue? (y/N): ');
      if (!proceed) {
        throw new Error('Component generation cancelled');
      }
    }
  }

  private async generateComponent(options: ComponentOptions): Promise<void> {
    const { name, category } = options;
    const componentDir = path.join(
      process.cwd(),
      COMPONENT_CATEGORIES[category].path,
      name
    );

    // Create directory
    fs.mkdirSync(componentDir, { recursive: true });

    // Generate files
    await this.generateComponentFile(componentDir, options);
    await this.generateStoryFile(componentDir, options);
    await this.generateTestFile(componentDir, options);
    await this.generateIndexFile(componentDir, options);

    console.log(`\n📁 Created ${name} component in: ${componentDir}`);
    console.log('📝 Files generated:');
    console.log(`  - ${name}.tsx`);
    console.log(`  - ${name}.stories.tsx`);
    console.log(`  - ${name}.test.tsx`);
    console.log(`  - index.ts`);
  }

  private async generateComponentFile(dir: string, options: ComponentOptions): Promise<void> {
    const { name, description, hasVariants, hasSizes, isInteractive } = options;
    const fileName = `${name}.tsx`;

    const variants = hasVariants ? this.generateVariantSystem(name, hasSizes) : '';
    const propsInterface = this.generatePropsInterface(name, hasVariants, hasSizes, isInteractive);
    const componentImpl = this.generateComponentImplementation(name, hasVariants, hasSizes, isInteractive);

    const content = `import React from 'react';
import { cn } from '@/lib/utils';
${hasVariants ? "import { cva, type VariantProps } from 'class-variance-authority';" : ''}
${isInteractive ? "import { motion } from 'framer-motion';" : ''}

${variants}

${propsInterface}

/**
 * ${description}
 * 
 * @example
 * <${name}${hasVariants ? ' variant="default"' : ''}${hasSizes ? ' size="md"' : ''}>
 *   Content
 * </${name}>
 */
${componentImpl}

${name}.displayName = '${name}';
`;

    fs.writeFileSync(path.join(dir, fileName), content);
  }

  private generateVariantSystem(name: string, hasSizes: boolean): string {
    const lowerName = name.toLowerCase();
    
    return `const ${lowerName}Variants = cva(
  // Base styles using V2 tokens
  'flex items-center justify-center bg-vergil-off-white text-vergil-off-black border border-vergil-emphasis-bg rounded-lg transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-vergil-off-white hover:bg-vergil-emphasis-bg',
        primary: 'bg-vergil-purple text-vergil-off-white hover:bg-vergil-emphasis-button-hover',
        secondary: 'bg-transparent border-vergil-purple text-vergil-purple hover:bg-vergil-emphasis-bg',
        destructive: 'bg-vergil-error text-vergil-off-white hover:opacity-90',
        ghost: 'border-transparent hover:bg-vergil-emphasis-bg',
      },${hasSizes ? `
      size: {
        sm: 'h-8 px-3 text-body-sm',
        md: 'h-10 px-4 text-body-md',
        lg: 'h-12 px-6 text-body-lg',
      },` : ''}
    },
    defaultVariants: {
      variant: 'default',${hasSizes ? `
      size: 'md',` : ''}
    },
  }
);`;
  }

  private generatePropsInterface(name: string, hasVariants: boolean, hasSizes: boolean, isInteractive: boolean): string {
    const baseProps = `React.${isInteractive ? 'ButtonHTMLAttributes<HTMLButtonElement>' : 'HTMLAttributes<HTMLDivElement>'}`;
    const variantProps = hasVariants ? `VariantProps<typeof ${name.toLowerCase()}Variants>` : '';
    const extendsClause = hasVariants ? `${baseProps},\n    ${variantProps}` : baseProps;

    return `export interface ${name}Props
  extends ${extendsClause} {
  /**
   * ${name} content
   */
  children?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
  
  /**
   * Loading state
   */
  loading?: boolean;
}`;
  }

  private generateComponentImplementation(name: string, hasVariants: boolean, hasSizes: boolean, isInteractive: boolean): string {
    const elementType = isInteractive ? 'button' : 'div';
    const refType = isInteractive ? 'HTMLButtonElement' : 'HTMLDivElement';
    const variantCall = hasVariants ? `${name.toLowerCase()}Variants({ variant, size })` : '"p-4 bg-vergil-off-white text-vergil-off-black rounded-lg"';
    const variantProps = hasVariants ? 'variant, size, ' : '';
    const motionProps = isInteractive ? `
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}` : '';

    const Component = isInteractive ? 'motion.' + elementType : elementType;

    return `export const ${name} = React.forwardRef<${refType}, ${name}Props>(
  ({ className, ${variantProps}children, disabled, loading, ...props }, ref) => {
    return (
      <${Component}
        ref={ref}
        className={cn(${variantCall}, className)}
        disabled={disabled || loading}${motionProps}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          children
        )}
      </${Component}>
    );
  }
);`;
  }

  private async generateStoryFile(dir: string, options: ComponentOptions): Promise<void> {
    const { name, category, description, hasVariants, hasSizes, isInteractive } = options;
    const fileName = `${name}.stories.tsx`;

    const categoryTitle = {
      ui: 'UI',
      vergil: 'Vergil',
      landing: 'Landing',
      lms: 'LMS',
      docs: 'Documentation'
    }[category];

    const argTypes = this.generateArgTypes(hasVariants, hasSizes, isInteractive);
    const stories = this.generateStories(name, hasVariants, hasSizes, isInteractive);

    const content = `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta = {
  title: '${categoryTitle}/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${description}. Uses V2 token system for consistent styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {${argTypes}
  },
} satisfies Meta<typeof ${name}>;

export default meta;
type Story = StoryObj<typeof meta>;

${stories}

// V2 Token Usage Examples
export const TokenShowcase: Story = {
  args: {
    children: 'V2 Token System',
  },
  parameters: {
    docs: {
      description: {
        story: \`
This component uses V2 tokens exclusively:
- Colors: vergil-purple, vergil-off-white, vergil-emphasis-bg
- Typography: text-body-md, text-h1, text-caption
- Spacing: space-4, space-8, space-12
- Never use arbitrary values or hardcoded colors
        \`,
      },
    },
  },
  render: (args) => (
    <div className="space-y-4">
      <${name} {...args} />
      <div className="text-caption text-vergil-emphasis-text">
        ✅ Uses V2 tokens only
      </div>
    </div>
  ),
};
`;

    fs.writeFileSync(path.join(dir, fileName), content);
  }

  private generateArgTypes(hasVariants: boolean, hasSizes: boolean, isInteractive: boolean): string {
    const argTypes = [];

    if (hasVariants) {
      argTypes.push(`
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'destructive', 'ghost'],
      description: 'Visual variant of the component',
    },`);
    }

    if (hasSizes) {
      argTypes.push(`
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },`);
    }

    argTypes.push(`
    children: {
      control: 'text',
      description: 'Content of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the component is in loading state',
    },`);

    return argTypes.join('');
  }

  private generateStories(name: string, hasVariants: boolean, hasSizes: boolean, isInteractive: boolean): string {
    const stories = [`export const Default: Story = {
  args: {
    children: '${name} content',
  },
};`];

    if (hasVariants) {
      stories.push(`
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary variant',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary variant',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive variant',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost variant',
  },
};`);
    }

    if (hasSizes) {
      stories.push(`
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
};`);
    }

    if (isInteractive) {
      stories.push(`
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled state',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading state',
  },
};`);
    }

    return stories.join('\n');
  }

  private async generateTestFile(dir: string, options: ComponentOptions): Promise<void> {
    const { name, hasVariants, hasSizes, isInteractive } = options;
    const fileName = `${name}.test.tsx`;

    const tests = this.generateTests(name, hasVariants, hasSizes, isInteractive);

    const content = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders children correctly', () => {
    render(<${name}>Test content</${name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <${name} className="custom-class">Content</${name}>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTML${isInteractive ? 'Button' : 'Div'}Element>();
    render(<${name} ref={ref}>Content</${name}>);
    expect(ref.current).toBeInTheDocument();
  });

${tests}

  // V2 Token System Tests
  it('uses V2 token classes', () => {
    const { container } = render(<${name}>Token test</${name}>);
    const element = container.firstChild as HTMLElement;
    
    // Check for V2 token usage (these should be present in the component)
    const classes = element.className;
    expect(classes).toMatch(/vergil-|space-|text-/);
    
    // Ensure no arbitrary values are used
    expect(classes).not.toMatch(/\\[.*\\]/);
  });

  it('maintains accessibility standards', () => {
    const { container } = render(<${name}>Accessible content</${name}>);
    const element = container.firstChild as HTMLElement;
    
    // Basic accessibility checks
    expect(element).toBeVisible();
    ${isInteractive ? `expect(element.tagName).toBe('BUTTON');` : ''}
  });
});
`;

    fs.writeFileSync(path.join(dir, fileName), content);
  }

  private generateTests(name: string, hasVariants: boolean, hasSizes: boolean, isInteractive: boolean): string {
    const tests = [];

    if (hasVariants) {
      tests.push(`  it('applies variant classes correctly', () => {
    const { container } = render(
      <${name} variant="primary">Primary variant</${name}>
    );
    expect(container.firstChild).toHaveClass('bg-vergil-purple');
  });`);
    }

    if (hasSizes) {
      tests.push(`  it('applies size classes correctly', () => {
    const { container } = render(
      <${name} size="lg">Large size</${name}>
    );
    expect(container.firstChild).toHaveClass('h-12');
  });`);
    }

    if (isInteractive) {
      tests.push(`  it('handles disabled state', () => {
    render(<${name} disabled>Disabled</${name}>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles loading state', () => {
    render(<${name} loading>Loading</${name}>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<${name} onClick={handleClick}>Clickable</${name}>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });`);
    }

    return tests.join('\n\n');
  }

  private async generateIndexFile(dir: string, options: ComponentOptions): Promise<void> {
    const { name } = options;
    const fileName = 'index.ts';

    const content = `export * from './${name}';
export type { ${name}Props } from './${name}';
`;

    fs.writeFileSync(path.join(dir, fileName), content);
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  private async confirm(question: string): Promise<boolean> {
    const answer = await this.prompt(question);
    return ['y', 'yes', 'true', '1'].includes(answer.toLowerCase().trim());
  }
}

// Run the generator
if (require.main === module) {
  const generator = new ComponentGenerator();
  generator.run().catch(console.error);
}

export { ComponentGenerator };