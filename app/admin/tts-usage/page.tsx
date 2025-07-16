import { TTSUsagePanel } from '@/components/admin/tts-usage-panel'

export default function TTSUsagePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">
            TTS Usage Monitoring
          </h1>
          <p className="text-text-secondary mt-2">
            Monitor Google Cloud Text-to-Speech usage and track free tier limits
          </p>
        </div>
        
        <TTSUsagePanel />
      </div>
    </div>
  )
}