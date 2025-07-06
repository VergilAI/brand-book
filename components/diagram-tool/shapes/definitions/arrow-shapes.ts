import { TemplateShape } from '@/app/map-editor/types/template-library'
import { 
  generateArrow, 
  generateDoubleArrow, 
  generateChevron,
  generateCornerArrow,
  generateCurvedArrow
} from '@/components/diagram-tool/shapes/generators/arrows'

export const arrowShapes: TemplateShape[] = [
  // Simple Arrow Right
  {
    id: 'arrow-right',
    name: 'Arrow Right',
    category: 'arrows',
    tags: ['arrow', 'right', 'direction', 'next'],
    icon: 'M 10 20 L 30 20 L 30 15 L 40 25 L 30 35 L 30 30 L 10 30 Z',
    defaultSize: { width: 100, height: 40 },
    path: (size) => generateArrow(size.width, size.height),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Simple Arrow Left
  {
    id: 'arrow-left',
    name: 'Arrow Left',
    category: 'arrows',
    tags: ['arrow', 'left', 'direction', 'back', 'previous'],
    icon: 'M 40 20 L 20 20 L 20 15 L 10 25 L 20 35 L 20 30 L 40 30 Z',
    defaultSize: { width: 100, height: 40 },
    path: (size) => {
      // Mirror the arrow horizontally
      return `
        M ${size.width} ${size.height * 0.2}
        L ${size.width * 0.4} ${size.height * 0.2}
        L ${size.width * 0.4} 0
        L 0 ${size.height / 2}
        L ${size.width * 0.4} ${size.height}
        L ${size.width * 0.4} ${size.height * 0.8}
        L ${size.width} ${size.height * 0.8}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Arrow Up
  {
    id: 'arrow-up',
    name: 'Arrow Up',
    category: 'arrows',
    tags: ['arrow', 'up', 'direction', 'north'],
    icon: 'M 25 10 L 15 20 L 20 20 L 20 40 L 30 40 L 30 20 L 35 20 Z',
    defaultSize: { width: 40, height: 100 },
    path: (size) => {
      const shaftWidth = size.width * 0.6
      const shaftX = (size.width - shaftWidth) / 2
      const headHeight = size.height * 0.4
      const shaftHeight = size.height - headHeight
      
      return `
        M ${shaftX} ${size.height}
        L ${shaftX} ${headHeight}
        L 0 ${headHeight}
        L ${size.width / 2} 0
        L ${size.width} ${headHeight}
        L ${shaftX + shaftWidth} ${headHeight}
        L ${shaftX + shaftWidth} ${size.height}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Arrow Down
  {
    id: 'arrow-down',
    name: 'Arrow Down',
    category: 'arrows',
    tags: ['arrow', 'down', 'direction', 'south'],
    icon: 'M 25 40 L 15 30 L 20 30 L 20 10 L 30 10 L 30 30 L 35 30 Z',
    defaultSize: { width: 40, height: 100 },
    path: (size) => {
      const shaftWidth = size.width * 0.6
      const shaftX = (size.width - shaftWidth) / 2
      const headHeight = size.height * 0.4
      const shaftHeight = size.height - headHeight
      
      return `
        M ${shaftX} 0
        L ${shaftX} ${shaftHeight}
        L 0 ${shaftHeight}
        L ${size.width / 2} ${size.height}
        L ${size.width} ${shaftHeight}
        L ${shaftX + shaftWidth} ${shaftHeight}
        L ${shaftX + shaftWidth} 0
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Double Arrow Horizontal
  {
    id: 'double-arrow-h',
    name: 'Double Arrow Horizontal',
    category: 'arrows',
    tags: ['arrow', 'double', 'bidirectional', 'resize'],
    icon: 'M 10 25 L 15 20 L 15 23 L 35 23 L 35 20 L 40 25 L 35 30 L 35 27 L 15 27 L 15 30 Z',
    defaultSize: { width: 120, height: 40 },
    path: (size) => generateDoubleArrow(size.width, size.height),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Double Arrow Vertical
  {
    id: 'double-arrow-v',
    name: 'Double Arrow Vertical',
    category: 'arrows',
    tags: ['arrow', 'double', 'bidirectional', 'resize'],
    icon: 'M 25 10 L 20 15 L 23 15 L 23 35 L 20 35 L 25 40 L 30 35 L 27 35 L 27 15 L 30 15 Z',
    defaultSize: { width: 40, height: 120 },
    path: (size) => {
      const shaftWidth = size.width * 0.6
      const shaftX = (size.width - shaftWidth) / 2
      const headHeight = size.height * 0.3
      const centerHeight = size.height - 2 * headHeight
      
      return `
        M ${size.width / 2} 0
        L 0 ${headHeight}
        L ${shaftX} ${headHeight}
        L ${shaftX} ${headHeight + centerHeight}
        L 0 ${headHeight + centerHeight}
        L ${size.width / 2} ${size.height}
        L ${size.width} ${headHeight + centerHeight}
        L ${shaftX + shaftWidth} ${headHeight + centerHeight}
        L ${shaftX + shaftWidth} ${headHeight}
        L ${size.width} ${headHeight}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Chevron Right
  {
    id: 'chevron-right',
    name: 'Chevron Right',
    category: 'arrows',
    tags: ['chevron', 'arrow', 'next', 'forward'],
    icon: generateChevron(20, 30, 0.3, 15, 10),
    defaultSize: { width: 60, height: 80 },
    path: (size) => generateChevron(size.width, size.height),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Chevron Left
  {
    id: 'chevron-left',
    name: 'Chevron Left',
    category: 'arrows',
    tags: ['chevron', 'arrow', 'back', 'previous'],
    icon: 'M 35 10 L 20 25 L 35 40 L 32 40 L 17 25 L 32 10 Z',
    defaultSize: { width: 60, height: 80 },
    path: (size) => {
      const t = 0.3 * Math.min(size.width, size.height)
      const midX = size.width / 2
      
      return `
        M ${size.width} 0
        L ${size.width - midX} ${size.height / 2}
        L ${size.width} ${size.height}
        L ${size.width - t} ${size.height}
        L ${size.width - midX - t/2} ${size.height / 2}
        L ${size.width - t} 0
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Corner Arrow
  {
    id: 'corner-arrow',
    name: 'Corner Arrow',
    category: 'arrows',
    tags: ['corner', 'turn', 'L-shaped', 'elbow'],
    icon: 'M 10 10 L 10 25 L 25 25 L 25 20 L 35 30 L 25 40 L 25 35 L 5 35 L 5 10 Z',
    defaultSize: { width: 80, height: 80 },
    path: (size) => generateCornerArrow(size.width, size.height),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Circular Arrow
  {
    id: 'circular-arrow',
    name: 'Circular Arrow',
    category: 'arrows',
    tags: ['refresh', 'rotate', 'cycle', 'reload'],
    icon: 'M 25 10 A 15 15 0 1 1 15 35 L 10 30 L 20 30 L 15 35 L 15 40',
    defaultSize: { width: 80, height: 80 },
    path: (size) => {
      const centerX = size.width / 2
      const centerY = size.height / 2
      const radius = Math.min(size.width, size.height) * 0.35
      const thickness = radius * 0.3
      const arrowSize = thickness * 1.5
      
      return `
        M ${centerX} ${centerY - radius}
        A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY}
        L ${centerX - radius + thickness} ${centerY}
        A ${radius - thickness} ${radius - thickness} 0 1 0 ${centerX} ${centerY - radius + thickness}
        Z
        M ${centerX - radius} ${centerY}
        L ${centerX - radius - arrowSize * 0.7} ${centerY - arrowSize}
        L ${centerX - radius + arrowSize * 0.3} ${centerY - arrowSize * 0.3}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  }
]