import TTSButtonSimpleTest from './TTSButtonSimpleTest'

export default {
  title: 'Voice/TTS Simple Test',
  component: TTSButtonSimpleTest,
}

export const Default = {
  args: {
    text: 'This is a simple test of the text to speech functionality.',
  },
}

export const Debug = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">TTS Debug Test</h3>
    <p className="text-sm text-gray-600">
      Open browser console to see debug logs. This simplified version will help identify the issue.
    </p>
    <TTSButtonSimpleTest text="Testing one two three" />
  </div>
)