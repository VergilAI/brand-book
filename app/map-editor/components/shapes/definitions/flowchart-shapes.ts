import { TemplateShape } from '../../../types/template-library'
import { generateRectangle, generateRoundedRectangle, generateDiamond, generateEllipse } from '../generators/polygon'

export const flowchartShapes: TemplateShape[] = [
  // Process (Rectangle)
  {
    id: 'flowchart-process',
    name: 'Process',
    category: 'flowchart',
    tags: ['process', 'action', 'rectangle'],
    icon: 'M 10 15 L 40 15 L 40 35 L 10 35 Z',
    defaultSize: { width: 100, height: 60 },
    path: (size) => generateRectangle(size.width, size.height),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Decision (Diamond)
  {
    id: 'flowchart-decision',
    name: 'Decision',
    category: 'flowchart',
    tags: ['decision', 'diamond', 'choice', 'condition'],
    icon: 'M 25 10 L 40 25 L 25 40 L 10 25 Z',
    defaultSize: { width: 80, height: 80 },
    path: (size) => generateDiamond(size.width, size.height),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Terminal (Rounded Rectangle)
  {
    id: 'flowchart-terminal',
    name: 'Terminal',
    category: 'flowchart',
    tags: ['terminal', 'start', 'end', 'rounded'],
    icon: 'M 15 20 Q 10 20 10 25 Q 10 30 15 30 L 35 30 Q 40 30 40 25 Q 40 20 35 20 Z',
    defaultSize: { width: 100, height: 50 },
    path: (size) => generateRoundedRectangle(size.width, size.height, size.height / 2),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Data (Parallelogram)
  {
    id: 'flowchart-data',
    name: 'Data',
    category: 'flowchart',
    tags: ['data', 'input', 'output', 'parallelogram'],
    icon: 'M 15 30 L 10 10 L 35 10 L 40 30 Z',
    defaultSize: { width: 100, height: 60 },
    path: (size) => {
      const skew = size.width * 0.15
      return `
        M ${skew} 0
        L ${size.width} 0
        L ${size.width - skew} ${size.height}
        L 0 ${size.height}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Document
  {
    id: 'flowchart-document',
    name: 'Document',
    category: 'flowchart',
    tags: ['document', 'report', 'output'],
    icon: 'M 10 10 L 40 10 L 40 35 Q 30 40 25 35 Q 20 30 15 35 Q 10 40 10 35 Z',
    defaultSize: { width: 80, height: 80 },
    path: (size) => {
      const waveHeight = size.height * 0.15
      const waveY = size.height - waveHeight
      return `
        M 0 0
        L ${size.width} 0
        L ${size.width} ${waveY}
        Q ${size.width * 0.75} ${size.height} ${size.width * 0.5} ${waveY}
        Q ${size.width * 0.25} ${waveY - waveHeight * 0.5} 0 ${waveY}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'complex'
  },
  
  // Manual Input
  {
    id: 'flowchart-manual-input',
    name: 'Manual Input',
    category: 'flowchart',
    tags: ['manual', 'input', 'keyboard'],
    icon: 'M 5 20 L 40 10 L 40 40 L 10 40 Z',
    defaultSize: { width: 100, height: 60 },
    path: (size) => {
      const slope = size.height * 0.2
      return `
        M 0 ${slope}
        L ${size.width} 0
        L ${size.width} ${size.height}
        L 0 ${size.height}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Preparation (Hexagon)
  {
    id: 'flowchart-preparation',
    name: 'Preparation',
    category: 'flowchart',
    tags: ['preparation', 'setup', 'hexagon'],
    icon: 'M 15 25 L 10 15 L 15 10 L 35 10 L 40 15 L 40 35 L 35 40 L 15 40 Z',
    defaultSize: { width: 100, height: 60 },
    path: (size) => {
      const chamfer = size.width * 0.15
      return `
        M ${chamfer} 0
        L ${size.width - chamfer} 0
        L ${size.width} ${size.height / 2}
        L ${size.width - chamfer} ${size.height}
        L ${chamfer} ${size.height}
        L 0 ${size.height / 2}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Connector (Circle)
  {
    id: 'flowchart-connector',
    name: 'Connector',
    category: 'flowchart',
    tags: ['connector', 'circle', 'junction'],
    icon: 'M 25 15 A 10 10 0 0 1 25 35 A 10 10 0 0 1 25 15',
    defaultSize: { width: 40, height: 40 },
    path: (size) => {
      const radius = Math.min(size.width, size.height) / 2
      return `
        M ${size.width / 2} ${size.height / 2 - radius}
        A ${radius} ${radius} 0 0 1 ${size.width / 2} ${size.height / 2 + radius}
        A ${radius} ${radius} 0 0 1 ${size.width / 2} ${size.height / 2 - radius}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Delay
  {
    id: 'flowchart-delay',
    name: 'Delay',
    category: 'flowchart',
    tags: ['delay', 'wait', 'timer'],
    icon: 'M 10 15 L 30 15 A 10 10 0 0 1 30 35 L 10 35 Z',
    defaultSize: { width: 80, height: 60 },
    path: (size) => {
      const radius = size.height / 2
      return `
        M 0 0
        L ${size.width - radius} 0
        A ${radius} ${radius} 0 0 1 ${size.width - radius} ${size.height}
        L 0 ${size.height}
        Z
      `.trim()
    },
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Database
  {
    id: 'flowchart-database',
    name: 'Database',
    category: 'flowchart',
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
  }
]