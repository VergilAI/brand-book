import { Card } from "@/components/ui/card"

export default function TestHeatmapPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Heatmap - Simple Version</h1>
      <Card className="p-8">
        <div 
          className="relative w-full h-[600px] bg-gradient-to-br from-background via-muted/30 to-background rounded-lg overflow-hidden"
        >
          {/* Just show the expected dimensions */}
          <div className="absolute inset-0 border-2 border-dashed border-red-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-dashed border-blue-500 bg-blue-500/10">
            <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold">
              600x600 Canvas Area
            </div>
          </div>
          
          {/* Test with a simple animated element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cosmic-purple/50 rounded-full animate-pulse"></div>
        </div>
      </Card>
    </div>
  )
}