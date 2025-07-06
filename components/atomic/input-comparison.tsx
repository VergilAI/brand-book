import React from 'react'
import { Input as NewInput } from './input'
import { Input as OldInput } from '../input'

export function InputComparison() {
  return (
    <div className="max-w-4xl mx-auto p-spacing-xl">
      <h1 className="text-3xl font-bold text-text-primary mb-spacing-lg">
        Input Component Comparison
      </h1>
      
      <div className="grid md:grid-cols-2 gap-spacing-xl">
        {/* Old Input */}
        <div className="space-y-spacing-md">
          <h2 className="text-xl font-semibold text-text-primary">
            Previous Input (components/input.tsx)
          </h2>
          <div className="p-spacing-lg bg-bg-secondary rounded-lg space-y-spacing-md">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-spacing-xs">
                Default Size (40px)
              </label>
              <OldInput placeholder="Old input design..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-error mb-spacing-xs">
                Error State
              </label>
              <OldInput error placeholder="Error state..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-success mb-spacing-xs">
                Success State
              </label>
              <OldInput success placeholder="Success state..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-disabled mb-spacing-xs">
                Disabled
              </label>
              <OldInput disabled placeholder="Disabled..." />
            </div>
          </div>
          <div className="text-sm text-text-secondary space-y-spacing-xs">
            <p>• Variable height (32px - 48px)</p>
            <p>• Uses size variants</p>
            <p>• Complex variant system</p>
            <p>• Shadow on focus</p>
          </div>
        </div>

        {/* New Input */}
        <div className="space-y-spacing-md">
          <h2 className="text-xl font-semibold text-text-primary">
            New Input (components/atomic/input.tsx)
          </h2>
          <div className="p-spacing-lg bg-bg-secondary rounded-lg space-y-spacing-md">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-spacing-xs">
                Standard Size (48px)
              </label>
              <NewInput placeholder="New input design..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-error mb-spacing-xs">
                Error State
              </label>
              <NewInput error placeholder="Error state..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-success mb-spacing-xs">
                Success State
              </label>
              <NewInput success placeholder="Success state..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-disabled mb-spacing-xs">
                Disabled
              </label>
              <NewInput disabled placeholder="Disabled..." />
            </div>
          </div>
          <div className="text-sm text-text-success space-y-spacing-xs">
            <p>✓ Fixed 48px height for consistency</p>
            <p>✓ 16px font prevents mobile zoom</p>
            <p>✓ Cleaner, minimal implementation</p>
            <p>✓ Ring focus state (more accessible)</p>
            <p>✓ Better hover states</p>
            <p>✓ Spacious padding (16px)</p>
          </div>
        </div>
      </div>

      <div className="mt-spacing-xl p-spacing-lg bg-bg-brandLight rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-sm">
          Key Improvements
        </h3>
        <div className="grid md:grid-cols-3 gap-spacing-md text-sm">
          <div>
            <h4 className="font-medium text-text-primary mb-spacing-xs">Accessibility</h4>
            <ul className="text-text-secondary space-y-1">
              <li>• 48px minimum touch target</li>
              <li>• Clear focus indicators</li>
              <li>• High contrast states</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-spacing-xs">Mobile UX</h4>
            <ul className="text-text-secondary space-y-1">
              <li>• 16px font prevents zoom</li>
              <li>• Comfortable tap targets</li>
              <li>• Smooth transitions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-spacing-xs">Design System</h4>
            <ul className="text-text-secondary space-y-1">
              <li>• Only semantic tokens</li>
              <li>• Consistent spacing</li>
              <li>• Matches button height</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}