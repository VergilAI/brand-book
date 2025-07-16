'use client'

export default function SpacingTestPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Spacing Test Page</h1>
      
      <div className="max-w-4xl mx-auto">
        {/* Test 1: Regular Tailwind spacing */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Test 1: Regular Tailwind Spacing (space-y-4)</h2>
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            <div className="p-4 bg-blue-100 rounded">Item 1</div>
            <div className="p-4 bg-blue-100 rounded">Item 2</div>
            <div className="p-4 bg-blue-100 rounded">Item 3</div>
          </div>
        </section>

        {/* Test 2: Custom spacing tokens */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Test 2: Custom Spacing Tokens</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">space-y-spacing-xs (4px)</h3>
            <div className="space-y-spacing-xs bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-purple-100 rounded">Item 1</div>
              <div className="p-4 bg-purple-100 rounded">Item 2</div>
              <div className="p-4 bg-purple-100 rounded">Item 3</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">space-y-spacing-sm (8px)</h3>
            <div className="space-y-spacing-sm bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-purple-100 rounded">Item 1</div>
              <div className="p-4 bg-purple-100 rounded">Item 2</div>
              <div className="p-4 bg-purple-100 rounded">Item 3</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">space-y-spacing-md (16px)</h3>
            <div className="space-y-spacing-md bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-purple-100 rounded">Item 1</div>
              <div className="p-4 bg-purple-100 rounded">Item 2</div>
              <div className="p-4 bg-purple-100 rounded">Item 3</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">space-y-spacing-lg (24px)</h3>
            <div className="space-y-spacing-lg bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-purple-100 rounded">Item 1</div>
              <div className="p-4 bg-purple-100 rounded">Item 2</div>
              <div className="p-4 bg-purple-100 rounded">Item 3</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">space-y-spacing-xl (32px)</h3>
            <div className="space-y-spacing-xl bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-purple-100 rounded">Item 1</div>
              <div className="p-4 bg-purple-100 rounded">Item 2</div>
              <div className="p-4 bg-purple-100 rounded">Item 3</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">space-y-spacing-2xl (48px)</h3>
            <div className="space-y-spacing-2xl bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-purple-100 rounded">Item 1</div>
              <div className="p-4 bg-purple-100 rounded">Item 2</div>
              <div className="p-4 bg-purple-100 rounded">Item 3</div>
            </div>
          </div>
        </section>

        {/* Test 3: Gap utilities */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Test 3: Gap Utilities</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">gap-spacing-md (16px)</h3>
            <div className="flex gap-spacing-md bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-green-100 rounded flex-1">Item 1</div>
              <div className="p-4 bg-green-100 rounded flex-1">Item 2</div>
              <div className="p-4 bg-green-100 rounded flex-1">Item 3</div>
            </div>
          </div>
        </section>

        {/* Test 4: Direct CSS variable usage */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Test 4: Direct CSS Variable Usage</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div style={{ marginBottom: 'var(--spacing-md)' }} className="p-4 bg-red-100 rounded">
              Item 1 (margin-bottom: var(--spacing-md))
            </div>
            <div style={{ marginBottom: 'var(--spacing-lg)' }} className="p-4 bg-red-100 rounded">
              Item 2 (margin-bottom: var(--spacing-lg))
            </div>
            <div className="p-4 bg-red-100 rounded">
              Item 3
            </div>
          </div>
        </section>

        {/* Test 5: Padding utilities */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Test 5: Padding Utilities</h2>
          <div className="space-y-4">
            <div className="p-spacing-xs bg-white rounded-lg shadow">p-spacing-xs (4px padding)</div>
            <div className="p-spacing-sm bg-white rounded-lg shadow">p-spacing-sm (8px padding)</div>
            <div className="p-spacing-md bg-white rounded-lg shadow">p-spacing-md (16px padding)</div>
            <div className="p-spacing-lg bg-white rounded-lg shadow">p-spacing-lg (24px padding)</div>
            <div className="p-spacing-xl bg-white rounded-lg shadow">p-spacing-xl (32px padding)</div>
            <div className="p-spacing-2xl bg-white rounded-lg shadow">p-spacing-2xl (48px padding)</div>
          </div>
        </section>

        {/* Test 6: Alternative syntax without 'spacing' prefix */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Test 6: Alternative Syntax (without 'spacing' prefix)</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">space-y-md (16px)</h3>
            <div className="space-y-md bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-orange-100 rounded">Item 1</div>
              <div className="p-4 bg-orange-100 rounded">Item 2</div>
              <div className="p-4 bg-orange-100 rounded">Item 3</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">space-y-lg (24px)</h3>
            <div className="space-y-lg bg-white p-6 rounded-lg shadow">
              <div className="p-4 bg-orange-100 rounded">Item 1</div>
              <div className="p-4 bg-orange-100 rounded">Item 2</div>
              <div className="p-4 bg-orange-100 rounded">Item 3</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}