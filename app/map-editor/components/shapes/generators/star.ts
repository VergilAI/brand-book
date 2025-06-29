/**
 * Generate a star SVG path
 * @param points Number of points on the star
 * @param outerRadius Radius to the outer points
 * @param innerRadius Radius to the inner points
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @returns SVG path string
 */
export function generateStar(
  points: number,
  outerRadius: number,
  innerRadius: number,
  centerX: number = 0,
  centerY: number = 0
): string {
  const angleStep = (2 * Math.PI) / (points * 2)
  const startAngle = -Math.PI / 2 // Start at top
  const pathPoints: string[] = []
  
  for (let i = 0; i < points * 2; i++) {
    const angle = startAngle + (i * angleStep)
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    pathPoints.push(`${x},${y}`)
  }
  
  return `M ${pathPoints.join(' L ')} Z`
}

/**
 * Generate a 5-point star with golden ratio proportions
 */
export function generatePerfectStar(
  size: number,
  centerX: number = 0,
  centerY: number = 0
): string {
  const outerRadius = size / 2
  const innerRadius = outerRadius * 0.382 // Golden ratio approximation
  return generateStar(5, outerRadius, innerRadius, centerX, centerY)
}

/**
 * Generate a burst/badge shape
 */
export function generateBurst(
  points: number,
  outerRadius: number,
  innerRadius: number,
  centerX: number = 0,
  centerY: number = 0
): string {
  const angleStep = (2 * Math.PI) / points
  const startAngle = -Math.PI / 2
  const pathData: string[] = []
  
  for (let i = 0; i < points; i++) {
    const angle = startAngle + (i * angleStep)
    const nextAngle = startAngle + ((i + 1) * angleStep)
    const midAngle = (angle + nextAngle) / 2
    
    // Outer point
    const outerX = centerX + outerRadius * Math.cos(angle)
    const outerY = centerY + outerRadius * Math.sin(angle)
    
    // Inner point (between outer points)
    const innerX = centerX + innerRadius * Math.cos(midAngle)
    const innerY = centerY + innerRadius * Math.sin(midAngle)
    
    if (i === 0) {
      pathData.push(`M ${outerX} ${outerY}`)
    } else {
      pathData.push(`L ${outerX} ${outerY}`)
    }
    pathData.push(`L ${innerX} ${innerY}`)
  }
  
  return `${pathData.join(' ')} Z`
}