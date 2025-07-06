/**
 * Generate a simple arrow pointing right
 */
export function generateArrow(
  width: number,
  height: number,
  headSize: number = 0.4, // Percentage of width for arrow head
  x: number = 0,
  y: number = 0
): string {
  const shaftHeight = height * 0.6
  const shaftY = y + (height - shaftHeight) / 2
  const headWidth = width * headSize
  const shaftWidth = width - headWidth
  
  return `
    M ${x} ${shaftY}
    L ${x + shaftWidth} ${shaftY}
    L ${x + shaftWidth} ${y}
    L ${x + width} ${y + height / 2}
    L ${x + shaftWidth} ${y + height}
    L ${x + shaftWidth} ${shaftY + shaftHeight}
    L ${x} ${shaftY + shaftHeight}
    Z
  `.trim()
}

/**
 * Generate a double-headed arrow (horizontal)
 */
export function generateDoubleArrow(
  width: number,
  height: number,
  headSize: number = 0.3,
  x: number = 0,
  y: number = 0
): string {
  const shaftHeight = height * 0.6
  const shaftY = y + (height - shaftHeight) / 2
  const headWidth = width * headSize
  const centerWidth = width - 2 * headWidth
  
  return `
    M ${x} ${y + height / 2}
    L ${x + headWidth} ${y}
    L ${x + headWidth} ${shaftY}
    L ${x + headWidth + centerWidth} ${shaftY}
    L ${x + headWidth + centerWidth} ${y}
    L ${x + width} ${y + height / 2}
    L ${x + headWidth + centerWidth} ${y + height}
    L ${x + headWidth + centerWidth} ${shaftY + shaftHeight}
    L ${x + headWidth} ${shaftY + shaftHeight}
    L ${x + headWidth} ${y + height}
    Z
  `.trim()
}

/**
 * Generate a curved arrow
 */
export function generateCurvedArrow(
  width: number,
  height: number,
  curve: number = 0.3, // How much to curve (0-1)
  x: number = 0,
  y: number = 0
): string {
  const endX = x + width
  const endY = y + height
  const controlX = x + width / 2
  const controlY = y - (height * curve)
  const headSize = Math.min(width, height) * 0.2
  
  // Calculate arrow head angle
  const dx = endX - controlX
  const dy = endY - controlY
  const angle = Math.atan2(dy, dx)
  
  // Arrow head points
  const headAngle = Math.PI / 6 // 30 degrees
  const head1X = endX - headSize * Math.cos(angle - headAngle)
  const head1Y = endY - headSize * Math.sin(angle - headAngle)
  const head2X = endX - headSize * Math.cos(angle + headAngle)
  const head2Y = endY - headSize * Math.sin(angle + headAngle)
  
  return `
    M ${x} ${y}
    Q ${controlX} ${controlY} ${endX} ${endY}
    M ${endX} ${endY}
    L ${head1X} ${head1Y}
    M ${endX} ${endY}
    L ${head2X} ${head2Y}
  `.trim()
}

/**
 * Generate a chevron arrow
 */
export function generateChevron(
  width: number,
  height: number,
  thickness: number = 0.3,
  x: number = 0,
  y: number = 0
): string {
  const t = thickness * Math.min(width, height)
  const midX = x + width / 2
  
  return `
    M ${x} ${y}
    L ${midX} ${y + height / 2}
    L ${x} ${y + height}
    L ${x + t} ${y + height}
    L ${midX + t/2} ${y + height / 2}
    L ${x + t} ${y}
    Z
  `.trim()
}

/**
 * Generate a corner arrow (L-shaped)
 */
export function generateCornerArrow(
  width: number,
  height: number,
  thickness: number = 0.3,
  corner: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'bottom-right',
  x: number = 0,
  y: number = 0
): string {
  const t = Math.min(width, height) * thickness
  const headSize = t * 1.5
  
  switch (corner) {
    case 'bottom-right':
      return `
        M ${x} ${y}
        L ${x} ${y + height - t}
        L ${x + width - headSize} ${y + height - t}
        L ${x + width - headSize} ${y + height - headSize * 1.5}
        L ${x + width} ${y + height}
        L ${x + width - headSize * 1.5} ${y + height - headSize}
        L ${x + width - t} ${y + height - headSize}
        L ${x + width - t} ${y + height}
        L ${x + t} ${y + height}
        L ${x + t} ${y}
        Z
      `.trim()
    
    // Add other corner variations as needed
    default:
      return generateCornerArrow(width, height, thickness, 'bottom-right', x, y)
  }
}