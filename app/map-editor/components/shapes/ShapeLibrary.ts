import { TemplateShape } from '../../types/template-library'
import { basicShapes } from './definitions/basic-shapes'
import { arrowShapes } from './definitions/arrow-shapes'
import { umlShapes } from './definitions/uml-shapes'
import { flowchartShapes } from './definitions/flowchart-shapes'

export class ShapeLibrary {
  private shapes: Map<string, TemplateShape> = new Map()
  private shapesByCategory: Map<string, TemplateShape[]> = new Map()
  
  constructor() {
    this.loadShapes()
  }
  
  private loadShapes() {
    // Load all shape definitions
    const allShapes = [
      ...basicShapes,
      ...arrowShapes,
      ...umlShapes,
      ...flowchartShapes
    ]
    
    // Index shapes by ID and category
    allShapes.forEach(shape => {
      this.shapes.set(shape.id, shape)
      
      if (!this.shapesByCategory.has(shape.category)) {
        this.shapesByCategory.set(shape.category, [])
      }
      this.shapesByCategory.get(shape.category)!.push(shape)
    })
  }
  
  getShape(id: string): TemplateShape | undefined {
    return this.shapes.get(id)
  }
  
  getShapesByCategory(category: string): TemplateShape[] {
    if (category === 'all') {
      return Array.from(this.shapes.values())
    }
    return this.shapesByCategory.get(category) || []
  }
  
  searchShapes(query: string): TemplateShape[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.shapes.values()).filter(shape => 
      shape.name.toLowerCase().includes(lowercaseQuery) ||
      shape.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }
  
  getAllCategories(): string[] {
    return Array.from(this.shapesByCategory.keys())
  }
  
  generateShapePath(shape: TemplateShape, size?: { width: number; height: number }): string {
    const finalSize = size || shape.defaultSize
    
    if (typeof shape.path === 'function') {
      return shape.path(finalSize)
    }
    
    return shape.path
  }
}

// Singleton instance
export const shapeLibrary = new ShapeLibrary()