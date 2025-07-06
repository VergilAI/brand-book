import { TemplateShape } from '../../../types/template-library'
import { generateRectangle, generateRoundedRectangle, generateEllipse } from '../generators/polygon'

export const umlShapes: TemplateShape[] = [
  // Class Box
  {
    id: 'uml-class',
    name: 'Class',
    category: 'uml',
    tags: ['class', 'box', 'object'],
    icon: 'M 10 10 L 40 10 L 40 40 L 10 40 Z M 10 20 L 40 20 M 10 30 L 40 30',
    defaultSize: { width: 120, height: 80 },
    path: (size) => {
      const thirdHeight = size.height / 3
      return `
        ${generateRectangle(size.width, size.height)}
        M 0 ${thirdHeight} L ${size.width} ${thirdHeight}
        M 0 ${thirdHeight * 2} L ${size.width} ${thirdHeight * 2}
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Interface
  {
    id: 'uml-interface',
    name: 'Interface',
    category: 'uml',
    tags: ['interface', 'contract'],
    icon: 'M 25 10 A 15 10 0 0 1 25 30 A 15 10 0 0 1 25 10 M 15 40 L 35 40',
    defaultSize: { width: 100, height: 80 },
    path: (size) => {
      const circleHeight = size.height * 0.6
      const lineY = size.height * 0.8
      return `
        ${generateEllipse(size.width / 2, circleHeight / 2, size.width / 2, circleHeight / 2)}
        M 0 ${lineY} L ${size.width} ${lineY}
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Package
  {
    id: 'uml-package',
    name: 'Package',
    category: 'uml',
    tags: ['package', 'namespace', 'folder'],
    icon: 'M 10 10 L 25 10 L 30 15 L 40 15 L 40 40 L 10 40 Z',
    defaultSize: { width: 120, height: 80 },
    path: (size) => {
      const tabWidth = size.width * 0.3
      const tabHeight = size.height * 0.2
      return `
        M 0 ${tabHeight}
        L 0 ${size.height}
        L ${size.width} ${size.height}
        L ${size.width} ${tabHeight}
        L ${tabWidth * 1.2} ${tabHeight}
        L ${tabWidth} 0
        L 0 0
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Component
  {
    id: 'uml-component',
    name: 'Component',
    category: 'uml',
    tags: ['component', 'module'],
    icon: 'M 10 10 L 40 10 L 40 40 L 10 40 Z M 5 15 L 10 15 M 5 25 L 10 25',
    defaultSize: { width: 100, height: 60 },
    path: (size) => {
      const connectorSize = size.width * 0.08
      const gap = size.height * 0.3
      return `
        ${generateRectangle(size.width, size.height)}
        M ${-connectorSize} ${gap} L 0 ${gap}
        M ${-connectorSize} ${size.height - gap} L 0 ${size.height - gap}
        M ${-connectorSize * 0.5} ${gap - connectorSize / 2} 
        L ${-connectorSize * 0.5} ${gap + connectorSize / 2}
        M ${-connectorSize * 0.5} ${size.height - gap - connectorSize / 2} 
        L ${-connectorSize * 0.5} ${size.height - gap + connectorSize / 2}
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Actor
  {
    id: 'uml-actor',
    name: 'Actor',
    category: 'uml',
    tags: ['actor', 'user', 'person', 'stick figure'],
    icon: 'M 25 12 A 3 3 0 0 1 25 18 M 25 18 L 25 32 M 15 22 L 35 22 M 25 32 L 18 40 M 25 32 L 32 40',
    defaultSize: { width: 40, height: 80 },
    path: (size) => {
      const headRadius = size.width * 0.15
      const centerX = size.width / 2
      const headY = headRadius * 1.5
      const bodyTop = headY + headRadius
      const bodyBottom = size.height * 0.75
      const armY = bodyTop + (bodyBottom - bodyTop) * 0.3
      const armSpan = size.width * 0.8
      const legBottom = size.height
      const legSpan = size.width * 0.6
      
      return `
        M ${centerX} ${headY - headRadius}
        A ${headRadius} ${headRadius} 0 0 1 ${centerX} ${headY + headRadius}
        A ${headRadius} ${headRadius} 0 0 1 ${centerX} ${headY - headRadius}
        M ${centerX} ${bodyTop}
        L ${centerX} ${bodyBottom}
        M ${centerX - armSpan / 2} ${armY}
        L ${centerX + armSpan / 2} ${armY}
        M ${centerX} ${bodyBottom}
        L ${centerX - legSpan / 2} ${legBottom}
        M ${centerX} ${bodyBottom}
        L ${centerX + legSpan / 2} ${legBottom}
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Use Case
  {
    id: 'uml-usecase',
    name: 'Use Case',
    category: 'uml',
    tags: ['use case', 'oval', 'functionality'],
    icon: 'M 25 15 A 15 10 0 0 1 25 35 A 15 10 0 0 1 25 15',
    defaultSize: { width: 120, height: 60 },
    path: (size) => generateEllipse(size.width / 2, size.height / 2, size.width / 2, size.height / 2),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Database
  {
    id: 'uml-database',
    name: 'Database',
    category: 'uml',
    tags: ['database', 'storage', 'cylinder'],
    icon: 'M 15 15 A 10 5 0 0 1 35 15 L 35 35 A 10 5 0 0 1 15 35 Z',
    defaultSize: { width: 60, height: 80 },
    path: (size) => {
      const radiusX = size.width / 2
      const radiusY = size.height * 0.15
      const centerX = radiusX
      const topY = radiusY
      const bottomY = size.height - radiusY
      
      return `
        M ${centerX - radiusX} ${topY}
        A ${radiusX} ${radiusY} 0 0 1 ${centerX + radiusX} ${topY}
        L ${centerX + radiusX} ${bottomY}
        A ${radiusX} ${radiusY} 0 0 1 ${centerX - radiusX} ${bottomY}
        L ${centerX - radiusX} ${topY}
        M ${centerX - radiusX} ${topY}
        A ${radiusX} ${radiusY} 0 0 0 ${centerX + radiusX} ${topY}
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Node
  {
    id: 'uml-node',
    name: 'Node',
    category: 'uml',
    tags: ['node', 'deployment', '3d', 'cube'],
    icon: 'M 10 15 L 30 15 L 35 10 L 35 30 L 30 35 L 10 35 Z M 30 15 L 35 10 M 30 15 L 30 35',
    defaultSize: { width: 80, height: 80 },
    path: (size) => {
      const depth = size.width * 0.2
      const frontWidth = size.width - depth
      const frontHeight = size.height - depth
      
      return `
        M 0 ${depth}
        L 0 ${size.height}
        L ${frontWidth} ${size.height}
        L ${frontWidth} ${depth}
        L ${size.width} 0
        L ${size.width} ${frontHeight}
        L ${depth} ${frontHeight}
        L ${depth} ${depth}
        Z
        M ${frontWidth} ${depth}
        L ${size.width} 0
        M ${frontWidth} ${depth}
        L ${frontWidth} ${size.height}
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  }
]