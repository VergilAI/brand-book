import { Button } from "@/components/ui/button"
import { ComponentPreview } from "@/components/docs/component-preview"
import { CodeBlock } from "@/components/docs/code-block"
import { Download, Plus, Trash2 } from "lucide-react"

export default function ButtonPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Button</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Displays a button or a component that looks like a button.
        </p>
      </div>

      {/* Basic Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        
        <ComponentPreview title="Default">
          <Button>Button</Button>
        </ComponentPreview>

        <CodeBlock>
{`import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return <Button>Button</Button>
}`}
        </CodeBlock>
      </section>

      {/* Variants */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Variants</h2>
        
        <ComponentPreview title="Button Variants">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </ComponentPreview>

        <CodeBlock>
{`<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`}
        </CodeBlock>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Sizes</h2>
        
        <ComponentPreview title="Button Sizes">
          <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </ComponentPreview>

        <CodeBlock>
{`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
        </CodeBlock>
      </section>

      {/* With Icons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">With Icons</h2>
        
        <ComponentPreview title="Icon Buttons">
          <div className="flex gap-4">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </ComponentPreview>

        <CodeBlock>
{`import { Download, Plus, Trash2 } from "lucide-react"

<Button>
  <Download className="mr-2 h-4 w-4" />
  Download
</Button>
<Button variant="outline">
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
<Button variant="destructive">
  <Trash2 className="mr-2 h-4 w-4" />
  Delete
</Button>
<Button size="icon" variant="ghost">
  <Plus className="h-4 w-4" />
</Button>`}
        </CodeBlock>
      </section>

      {/* Loading State */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Loading State</h2>
        
        <ComponentPreview title="Button Variants">
          <div className="flex gap-4">
            <Button>Default</Button>
            <Button variant="outline">
              Outline
            </Button>
          </div>
        </ComponentPreview>

        <CodeBlock>
{`<Button>Default</Button>
<Button variant="outline">
  Outline
</Button>`}
        </CodeBlock>
      </section>

      {/* Props */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="border border-gray-200 p-3 text-left">Prop</th>
                <th className="border border-gray-200 p-3 text-left">Type</th>
                <th className="border border-gray-200 p-3 text-left">Default</th>
                <th className="border border-gray-200 p-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-3 font-mono text-sm">variant</td>
                <td className="border border-gray-200 p-3 font-mono text-sm">
                  'default' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link'
                </td>
                <td className="border border-gray-200 p-3">'default'</td>
                <td className="border border-gray-200 p-3">Visual style of the button</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-mono text-sm">size</td>
                <td className="border border-gray-200 p-3 font-mono text-sm">
                  'sm' | 'md' | 'lg' | 'icon'
                </td>
                <td className="border border-gray-200 p-3">'md'</td>
                <td className="border border-gray-200 p-3">Size of the button</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-mono text-sm">loading</td>
                <td className="border border-gray-200 p-3 font-mono text-sm">boolean</td>
                <td className="border border-gray-200 p-3">false</td>
                <td className="border border-gray-200 p-3">Shows loading spinner and disables the button</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-3 font-mono text-sm">asChild</td>
                <td className="border border-gray-200 p-3 font-mono text-sm">boolean</td>
                <td className="border border-gray-200 p-3 font-mono text-sm">false</td>
                <td className="border border-gray-200 p-3">Renders as child component using Radix Slot</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Accessibility */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <div className="space-y-2 text-muted-foreground">
          <p>• Keyboard accessible - can be focused and activated with Enter or Space</p>
          <p>• Focus visible indicators are provided</p>
          <p>• Loading state is announced to screen readers with aria-busy</p>
          <p>• Disabled state prevents interaction and is announced to screen readers</p>
        </div>
      </section>
    </div>
  )
}