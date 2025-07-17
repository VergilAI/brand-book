'use client'

import {
  ContextWindowProvider,
  ContextWindowLayout,
  ContextWindow,
  ContextWindowTrigger,
} from '@/components/context-window'

export default function KnowledgeDemoPage() {
  return (
    <ContextWindowProvider>
      <ContextWindowLayout>
        {/* Main Content */}
        <div className="min-h-screen bg-secondary">
          <div className="max-w-7xl mx-auto p-spacing-lg">
            <h1 className="text-3xl font-bold text-primary mb-spacing-lg">
              Knowledge Demo - Context Window
            </h1>
            
            <div className="grid gap-spacing-md">
              <div className="bg-primary rounded-lg p-spacing-lg shadow-sm">
                <h2 className="text-xl font-semibold text-primary mb-spacing-sm">
                  Clean Architecture
                </h2>
                <p className="text-secondary text-base leading-relaxed">
                  This new implementation uses a flex-based layout where the main content 
                  and context window are siblings. The main section automatically adjusts 
                  its width when the context window opens, creating a true responsive 
                  experience without any hacks or DOM manipulation.
                </p>
              </div>

              <div className="bg-primary rounded-lg p-spacing-lg shadow-sm">
                <h3 className="text-lg font-medium text-primary mb-spacing-sm">
                  Features
                </h3>
                <ul className="space-y-spacing-xs text-secondary">
                  <li>• True responsive layout with flex containers</li>
                  <li>• No white background or visual artifacts</li>
                  <li>• Smooth width-based animations</li>
                  <li>• Keyboard shortcut support (Cmd/Ctrl + K)</li>
                  <li>• Clean component architecture</li>
                  <li>• Natural content reflow</li>
                  <li>• Fixed 400px width context panel</li>
                </ul>
              </div>

              <div className="bg-primary rounded-lg p-spacing-lg shadow-sm">
                <h3 className="text-lg font-medium text-primary mb-spacing-sm">
                  How It Works
                </h3>
                <p className="text-secondary text-base leading-relaxed mb-spacing-sm">
                  The layout uses a simple flex container with two children: the main 
                  section (flex-1) and the context window (fixed width). When the context 
                  window opens, it transitions from 0 to 400px width, and the main section 
                  automatically adjusts to fill the remaining space.
                </p>
                <p className="text-secondary text-base leading-relaxed">
                  This approach ensures content reflows naturally, just like resizing a 
                  browser window. No transforms, no scaling, no DOM manipulation - just 
                  clean CSS and React.
                </p>
              </div>

              <div className="bg-primary rounded-lg p-spacing-lg shadow-sm">
                <h3 className="text-lg font-medium text-primary mb-spacing-sm">
                  Try It Out
                </h3>
                <p className="text-secondary text-base leading-relaxed">
                  Click the info button on the right or press <kbd className="px-2 py-1 bg-emphasis rounded text-sm">Cmd+K</kbd> to 
                  toggle the context window. Notice how the content smoothly adjusts 
                  without any background artifacts or layout issues.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Context Window Trigger */}
        <ContextWindowTrigger />

        {/* Context Window Content */}
        <ContextWindow>
          <div className="space-y-spacing-md">
            <div className="p-spacing-md bg-emphasis rounded-lg">
              <h3 className="font-medium text-primary mb-spacing-xs">
                Knowledge Point Details
              </h3>
              <p className="text-sm text-secondary">
                This is where detailed information about knowledge points would appear. 
                The content is properly contained within the context window with no 
                overflow or layout issues.
              </p>
            </div>

            <div className="p-spacing-md bg-emphasis rounded-lg">
              <h3 className="font-medium text-primary mb-spacing-xs">
                Learning Progress
              </h3>
              <div className="space-y-spacing-xs">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Mastery Level</span>
                  <span className="text-primary font-medium">75%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-brand rounded-full" />
                </div>
              </div>
            </div>

            <div className="p-spacing-md bg-emphasis rounded-lg">
              <h3 className="font-medium text-primary mb-spacing-xs">
                Related Concepts
              </h3>
              <ul className="space-y-spacing-xs text-sm text-secondary">
                <li>• Component Architecture</li>
                <li>• State Management</li>
                <li>• Responsive Design</li>
                <li>• CSS Flexbox</li>
              </ul>
            </div>
          </div>
        </ContextWindow>
      </ContextWindowLayout>
    </ContextWindowProvider>
  )
}