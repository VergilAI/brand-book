/**
 * Generate a regular polygon SVG path
 * @param sides Number of sides
 * @param radius Radius of the polygon
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @returns SVG path string
 */
export function generatePolygon(
  sides: number,
  radius: number,
  centerX: number = 0,
  centerY: number = 0
): string {
  const points: string[] = []
  const angleStep = (2 * Math.PI) / sides
  const startAngle = -Math.PI / 2 // Start at top
  
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (i * angleStep)
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }
  
  return `M ${points.join(' L ')} Z`
}

/**
 * Generate a rectangle SVG path
 */
export function generateRectangle(
  width: number,
  height: number,
  x: number = 0,
  y: number = 0
): string {
  return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`
}

/**
 * Generate a rounded rectangle SVG path
 */
export function generateRoundedRectangle(
  width: number,
  height: number,
  radius: number,
  x: number = 0,
  y: number = 0
): string {
  const r = Math.min(radius, width / 2, height / 2)
  return `
    M ${x + r} ${y}
    L ${x + width - r} ${y}
    Q ${x + width} ${y} ${x + width} ${y + r}
    L ${x + width} ${y + height - r}
    Q ${x + width} ${y + height} ${x + width - r} ${y + height}
    L ${x + r} ${y + height}
    Q ${x} ${y + height} ${x} ${y + height - r}
    L ${x} ${y + r}
    Q ${x} ${y} ${x + r} ${y}
    Z
  `.trim()
}

/**
 * Generate a circle SVG path
 */
export function generateCircle(
  radius: number,
  centerX: number = 0,
  centerY: number = 0
): string {
  // Use two arcs to create a complete circle
  return `
    M ${centerX - radius} ${centerY}
    A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}
    A ${radius} ${radius} 0 0 1 ${centerX - radius} ${centerY}
    Z
  `.trim()
}

/**
 * Generate an ellipse SVG path
 */
export function generateEllipse(
  radiusX: number,
  radiusY: number,
  centerX: number = 0,
  centerY: number = 0
): string {
  return `
    M ${centerX - radiusX} ${centerY}
    A ${radiusX} ${radiusY} 0 0 1 ${centerX + radiusX} ${centerY}
    A ${radiusX} ${radiusY} 0 0 1 ${centerX - radiusX} ${centerY}
    Z
  `.trim()
}

/**
 * Generate a diamond (rhombus) SVG path
 */
export function generateDiamond(
  width: number,
  height: number,
  x: number = 0,
  y: number = 0
): string {
  const halfWidth = width / 2
  const halfHeight = height / 2
  return `
    M ${x + halfWidth} ${y}
    L ${x + width} ${y + halfHeight}
    L ${x + halfWidth} ${y + height}
    L ${x} ${y + halfHeight}
    Z
  `.trim()
}

/**
 * Generate a parallelogram SVG path
 */
export function generateParallelogram(
  width: number,
  height: number,
  skew: number = 20,
  x: number = 0,
  y: number = 0
): string {
  return `
    M ${x + skew} ${y}
    L ${x + width} ${y}
    L ${x + width - skew} ${y + height}
    L ${x} ${y + height}
    Z
  `.trim()
}

/**
 * Generate a trapezoid SVG path
 */
export function generateTrapezoid(
  topWidth: number,
  bottomWidth: number,
  height: number,
  x: number = 0,
  y: number = 0
): string {
  const topOffset = (bottomWidth - topWidth) / 2
  return `
    M ${x + topOffset} ${y}
    L ${x + topOffset + topWidth} ${y}
    L ${x + bottomWidth} ${y + height}
    L ${x} ${y + height}
    Z
  `.trim()
}