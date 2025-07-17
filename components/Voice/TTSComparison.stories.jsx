import TTSButton from './TTSButton'
import TTSButtonEnhanced from './TTSButtonEnhanced'

export default {
  title: 'Voice/TTS Comparison',
  parameters: {
    layout: 'padded',
  },
}

const sampleText = "This is a sample text for comparing the two TTS components. Notice how the enhanced version provides a cleaner interface with better audio controls and no duplicate progress bars."

// Side by side comparison
export const SideBySideComparison = () => (
  <div className="space-y-8 max-w-6xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-text-primary mb-2">TTS Component Comparison</h1>
      <p className="text-text-secondary">Original vs Enhanced Version</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Original Component */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <h2 className="text-lg font-semibold text-text-primary">Original TTS Button</h2>
        </div>
        
        <div className="p-4 bg-bg-secondary rounded-lg border border-border-subtle">
          <TTSButton text={sampleText} />
        </div>
        
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-text-primary">Issues:</h3>
          <ul className="space-y-1 text-text-secondary list-disc list-inside">
            <li>Two progress bars (button overlay + separate bar)</li>
            <li>Progress on button is hard to see (1px height)</li>
            <li>Cluttered interface when playing</li>
            <li>No volume control</li>
            <li>Cannot seek through audio</li>
            <li>Less intuitive design</li>
          </ul>
        </div>
      </div>
      
      {/* Enhanced Component */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <h2 className="text-lg font-semibold text-text-primary">Enhanced TTS Player</h2>
        </div>
        
        <div className="p-4 bg-bg-secondary rounded-lg border border-border-subtle">
          <TTSButtonEnhanced text={sampleText} showTranscript={false} />
        </div>
        
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-text-primary">Improvements:</h3>
          <ul className="space-y-1 text-text-secondary list-disc list-inside">
            <li>Single, clear progress bar</li>
            <li>Clean card-based design</li>
            <li>Volume control with mute toggle</li>
            <li>Click-to-seek functionality</li>
            <li>Better visual hierarchy</li>
            <li>Optional transcript display</li>
          </ul>
        </div>
      </div>
    </div>
    
    {/* Feature Comparison Table */}
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Feature Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left p-3 font-semibold text-text-primary">Feature</th>
              <th className="text-center p-3 font-semibold text-text-primary">Original</th>
              <th className="text-center p-3 font-semibold text-text-primary">Enhanced</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border-subtle">
              <td className="p-3 text-text-secondary">Progress Bars</td>
              <td className="p-3 text-center">2 (Duplicate)</td>
              <td className="p-3 text-center">1 (Clean)</td>
            </tr>
            <tr className="border-b border-border-subtle">
              <td className="p-3 text-text-secondary">Volume Control</td>
              <td className="p-3 text-center text-red-500">✗</td>
              <td className="p-3 text-center text-green-500">✓</td>
            </tr>
            <tr className="border-b border-border-subtle">
              <td className="p-3 text-text-secondary">Seek Functionality</td>
              <td className="p-3 text-center text-red-500">✗</td>
              <td className="p-3 text-center text-green-500">✓</td>
            </tr>
            <tr className="border-b border-border-subtle">
              <td className="p-3 text-text-secondary">Transcript Display</td>
              <td className="p-3 text-center text-red-500">✗</td>
              <td className="p-3 text-center text-green-500">✓</td>
            </tr>
            <tr className="border-b border-border-subtle">
              <td className="p-3 text-text-secondary">Visual Design</td>
              <td className="p-3 text-center">Basic</td>
              <td className="p-3 text-center">Modern</td>
            </tr>
            <tr className="border-b border-border-subtle">
              <td className="p-3 text-text-secondary">State Clarity</td>
              <td className="p-3 text-center">Good</td>
              <td className="p-3 text-center">Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

// Demo of duplicate progress bar issue
export const DuplicateProgressBarIssue = () => (
  <div className="space-y-8 max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-xl font-bold text-text-primary mb-2">The Duplicate Progress Bar Issue</h1>
      <p className="text-text-secondary">Original component shows progress in two places</p>
    </div>
    
    <div className="p-6 bg-bg-error-light border border-border-error rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">!</div>
        <div>
          <h3 className="font-semibold text-text-primary">Original Component Issue</h3>
          <p className="text-sm text-text-secondary">When playing, you'll see two progress indicators</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-text-secondary mb-2">Click play and observe:</p>
        <TTSButton text="Click play to see the duplicate progress bars. One appears at the bottom of the button, and another appears below as a separate element." />
        
        <div className="mt-4 p-4 bg-white rounded border border-red-300">
          <p className="text-sm text-red-700 font-medium mb-2">Issues visible when playing:</p>
          <ol className="list-decimal list-inside text-sm text-red-600 space-y-1">
            <li>Thin 1px progress bar at bottom of button (hard to see)</li>
            <li>Separate progress bar below with time display</li>
            <li>Both show the same information redundantly</li>
          </ol>
        </div>
      </div>
    </div>
    
    <div className="p-6 bg-bg-success-light border border-border-success rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
        <div>
          <h3 className="font-semibold text-text-primary">Enhanced Component Solution</h3>
          <p className="text-sm text-text-secondary">Clean interface with single progress bar</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-text-secondary mb-2">Click play to see the improvement:</p>
        <TTSButtonEnhanced text="Click play to see the clean, single progress bar. The interface is much clearer with better visual hierarchy and additional features like volume control." />
      </div>
    </div>
  </div>
)

// Interactive feature demo
export const InteractiveFeatureDemo = () => (
  <div className="space-y-8 max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-xl font-bold text-text-primary mb-2">New Features Demo</h1>
      <p className="text-text-secondary">Try out the enhanced features</p>
    </div>
    
    <div className="space-y-8">
      {/* Volume Control Demo */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Volume Control</h3>
          <p className="text-sm text-text-secondary mb-4">Hover over the volume button to see the slider</p>
          <TTSButtonEnhanced 
            text="Test the volume control by hovering over the speaker icon and adjusting the slider. You can also click to mute/unmute."
            showTranscript={false}
          />
        </CardContent>
      </Card>
      
      {/* Seek Functionality Demo */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Seek Functionality</h3>
          <p className="text-sm text-text-secondary mb-4">Click anywhere on the progress bar to jump to that position</p>
          <TTSButtonEnhanced 
            text="Start playing this audio, then click anywhere on the progress bar to jump to that position. This is especially useful for longer audio content."
            showTranscript={false}
          />
        </CardContent>
      </Card>
      
      {/* Transcript Display Demo */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Transcript Display</h3>
          <p className="text-sm text-text-secondary mb-4">Optional transcript for following along</p>
          <TTSButtonEnhanced 
            text="This example shows the transcript display feature. Users can read along while listening, which is particularly useful for language learning or comprehension exercises. The transcript is displayed in a scrollable container below the audio player."
            showTranscript={true}
          />
        </CardContent>
      </Card>
    </div>
  </div>
)

// Required imports
import { Card, CardContent } from '@/components/card'