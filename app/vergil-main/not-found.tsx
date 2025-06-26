import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-space">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The Vergil Main platform page is currently under development. Please check back soon or explore our other pages.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/brand">Brand Book</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/vergil-learn">Vergil Learn</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}