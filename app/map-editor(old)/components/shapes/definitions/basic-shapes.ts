import { TemplateShape } from '../../../types/template-library'
import { 
  generateRectangle, 
  generateCircle, 
  generatePolygon, 
  generateDiamond,
  generateEllipse,
  generateRoundedRectangle,
  generateParallelogram,
  generateTrapezoid
} from '../generators/polygon'
import { generatePerfectStar, generateStar } from '../generators/star'

export const basicShapes: TemplateShape[] = [
  // Rectangle
  {
    id: 'rectangle',
    name: 'Rectangle',
    category: 'basic',
    tags: ['square', 'box', 'rect'],
    icon: 'M 10 10 L 40 10 L 40 30 L 10 30 Z',
    defaultSize: { width: 100, height: 60 },
    path: (size) => generateRectangle(size.width, size.height),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Square
  {
    id: 'square',
    name: 'Square',
    category: 'basic',
    tags: ['box', 'rect'],
    icon: 'M 15 15 L 35 15 L 35 35 L 15 35 Z',
    defaultSize: { width: 80, height: 80 },
    path: (size) => generateRectangle(size.width, size.height),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Rounded Rectangle
  {
    id: 'rounded-rectangle',
    name: 'Rounded Rectangle',
    category: 'basic',
    tags: ['box', 'rect', 'round'],
    icon: 'M 15 10 Q 10 10 10 15 L 10 25 Q 10 30 15 30 L 35 30 Q 40 30 40 25 L 40 15 Q 40 10 35 10 Z',
    defaultSize: { width: 100, height: 60 },
    path: (size) => generateRoundedRectangle(size.width, size.height, 10),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Circle
  {
    id: 'circle',
    name: 'Circle',
    category: 'basic',
    tags: ['round', 'ellipse', 'oval'],
    icon: 'M 25 15 A 10 10 0 0 1 25 35 A 10 10 0 0 1 25 15',
    defaultSize: { width: 80, height: 80 },
    path: (size) => generateCircle(size.width / 2, size.width / 2, size.height / 2),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Ellipse
  {
    id: 'ellipse',
    name: 'Ellipse',
    category: 'basic',
    tags: ['oval', 'round'],
    icon: 'M 25 10 A 15 10 0 0 1 25 30 A 15 10 0 0 1 25 10',
    defaultSize: { width: 100, height: 60 },
    path: (size) => generateEllipse(size.width / 2, size.height / 2, size.width / 2, size.height / 2),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Triangle
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'basic',
    tags: ['tri', 'delta'],
    icon: 'M 25 10 L 40 35 L 10 35 Z',
    defaultSize: { width: 80, height: 80 },
    path: (size) => generatePolygon(3, Math.min(size.width, size.height) / 2, size.width / 2, size.height / 2),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Diamond
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'basic',
    tags: ['rhombus', 'lozenge'],
    icon: 'M 25 10 L 40 25 L 25 40 L 10 25 Z',
    defaultSize: { width: 80, height: 80 },
    path: (size) => generateDiamond(size.width, size.height),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Pentagon
  {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'basic',
    tags: ['5-sided', 'polygon'],
    icon: generatePolygon(5, 15, 25, 25),
    defaultSize: { width: 80, height: 80 },
    path: (size) => generatePolygon(5, Math.min(size.width, size.height) / 2, size.width / 2, size.height / 2),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Hexagon
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'basic',
    tags: ['6-sided', 'hex', 'polygon'],
    icon: generatePolygon(6, 15, 25, 25),
    defaultSize: { width: 80, height: 80 },
    path: (size) => generatePolygon(6, Math.min(size.width, size.height) / 2, size.width / 2, size.height / 2),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Octagon
  {
    id: 'octagon',
    name: 'Octagon',
    category: 'basic',
    tags: ['8-sided', 'stop', 'polygon'],
    icon: generatePolygon(8, 15, 25, 25),
    defaultSize: { width: 80, height: 80 },
    path: (size) => generatePolygon(8, Math.min(size.width, size.height) / 2, size.width / 2, size.height / 2),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Star (5-point)
  {
    id: 'star-5',
    name: '5-Point Star',
    category: 'basic',
    tags: ['star', 'favorite', 'rating'],
    icon: generatePerfectStar(30, 25, 25),
    defaultSize: { width: 80, height: 80 },
    path: (size) => generatePerfectStar(Math.min(size.width, size.height), size.width / 2, size.height / 2),
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Star (6-point)
  {
    id: 'star-6',
    name: '6-Point Star',
    category: 'basic',
    tags: ['star', 'david'],
    icon: generateStar(6, 15, 8, 25, 25),
    defaultSize: { width: 80, height: 80 },
    path: (size) => {
      const radius = Math.min(size.width, size.height) / 2
      return generateStar(6, radius, radius * 0.5, size.width / 2, size.height / 2)
    },
    resizable: true,
    maintainAspectRatio: true,
    bezierComplexity: 'simple'
  },
  
  // Parallelogram
  {
    id: 'parallelogram',
    name: 'Parallelogram',
    category: 'basic',
    tags: ['skew', 'slanted'],
    icon: 'M 15 30 L 10 10 L 35 10 L 40 30 Z',
    defaultSize: { width: 100, height: 60 },
    path: (size) => generateParallelogram(size.width, size.height, size.width * 0.2),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  },
  
  // Trapezoid
  {
    id: 'trapezoid',
    name: 'Trapezoid',
    category: 'basic',
    tags: ['trapezium'],
    icon: 'M 15 10 L 35 10 L 40 30 L 10 30 Z',
    defaultSize: { width: 100, height: 60 },
    path: (size) => generateTrapezoid(size.width * 0.6, size.width, size.height),
    resizable: true,
    maintainAspectRatio: false,
    bezierComplexity: 'simple'
  }
]