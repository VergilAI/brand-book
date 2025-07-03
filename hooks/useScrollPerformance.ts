import { useEffect, useRef, useState } from 'react'

export function useScrollPerformance(elementRef: React.RefObject<HTMLElement>) {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleScroll = () => {
      setIsScrolling(true)
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Set scrolling to false after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    element.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [elementRef])

  return isScrolling
}