"use client"

import { useCallback, useMemo } from 'react'
import { useDrawingTool } from './useDrawingTool'
import { Point } from '../types/drawing'
import { SnapResult, SnapIndicator } from '../types/snapping'
import { getSnapCandidates, getAlignmentGuides, snapPointToAngle, getAngle } from '../utils/snapping'

export function useSnapping() {
  const store = useDrawingTool()
  const { snapping, view, document, editing } = store
  
  // Get the shape being edited (if any) to exclude from snapping
  const excludeShapeId = editing.isEditing ? editing.editingShapeId : undefined
  
  // Get snap point with all snap types considered
  const getSnappedPoint = useCallback((point: Point, excludeShapeIds?: string | string[]): { point: Point; snapResult: SnapResult | null; indicators: SnapIndicator[] } => {
    // If snapping is disabled or temporarily disabled, return original point
    if (!snapping.settings.enabled || snapping.temporaryDisabled) {
      return { point, snapResult: null, indicators: [] }
    }
    
    const shapes = Object.values(document.shapes)
    const indicators: SnapIndicator[] = []
    
    // Handle both single and multiple excluded IDs
    const excludeId = Array.isArray(excludeShapeIds) ? undefined : excludeShapeIds
    const excludeIds = Array.isArray(excludeShapeIds) ? excludeShapeIds : (excludeShapeIds ? [excludeShapeIds] : [])
    
    // Filter shapes if multiple IDs to exclude
    const filteredShapes = excludeIds.length > 0 
      ? shapes.filter(s => !excludeIds.includes(s.id))
      : shapes
    
    // Get snap candidates
    const candidates = getSnapCandidates(
      point,
      filteredShapes,
      snapping.settings,
      view.gridSize,
      excludeId
    )
    
    // Use the best snap candidate if any
    const snapResult = candidates[0] || null
    const snappedPoint = snapResult ? snapResult.point : point
    
    // Create snap indicators
    if (snapResult && snapping.settings.showSnapIndicators) {
      // Point indicator for the snap target
      indicators.push({
        id: `snap-point-${Date.now()}`,
        type: 'point',
        geometry: snapResult.point,
        style: {
          color: getSnapColor(snapResult.type),
          width: 2,
          radius: getSnapRadius(snapResult.type)
        }
      })
      
      // Line from cursor to snap point
      if (snapResult.distance > 2) {
        indicators.push({
          id: `snap-line-${Date.now()}`,
          type: 'line',
          geometry: {
            start: point,
            end: snapResult.point
          },
          style: {
            color: getSnapColor(snapResult.type),
            width: 1,
            pattern: 'dashed'
          }
        })
      }
    }
    
    // Get alignment guides if enabled
    if (snapping.settings.guideSnap) {
      const { guides, alignedElements } = getAlignmentGuides(snappedPoint, filteredShapes, 5)
      
      // Add guide lines
      guides.forEach((guide, index) => {
        indicators.push({
          id: `guide-${Date.now()}-${index}`,
          type: 'guide',
          geometry: guide,
          style: {
            color: '#0066FF',
            width: 1,
            pattern: 'dashed'
          }
        })
      })
      
      // Add indicators for aligned elements
      alignedElements.forEach((element, index) => {
        if (element.type === 'vertex') {
          indicators.push({
            id: `aligned-vertex-${Date.now()}-${index}`,
            type: 'point',
            geometry: element.point,
            style: {
              color: '#0066FF',
              width: 2,
              radius: 6
            }
          })
        } else if (element.type === 'center') {
          // Special indicator for centers
          indicators.push({
            id: `aligned-center-${Date.now()}-${index}`,
            type: 'point',
            geometry: element.point,
            style: {
              color: '#FF6600',
              width: 2,
              radius: 8
            }
          })
        }
      })
    }
    
    return { point: snappedPoint, snapResult, indicators }
  }, [snapping, document.shapes, view.gridSize, excludeShapeId])
  
  // Get snapped point for drawing with angle snap
  const getSnappedDrawingPoint = useCallback((point: Point, previousPoint?: Point): { point: Point; snapResult: SnapResult | null; indicators: SnapIndicator[] } => {
    // First apply regular snapping
    const result = getSnappedPoint(point)
    
    // If angle snapping is enabled and we have a previous point
    if (snapping.settings.angleSnap && previousPoint && !snapping.temporaryDisabled) {
      // Apply angle snapping to the already-snapped point (or original if no snap)
      const pointToSnap = result.point
      const angleSnapped = snapPointToAngle(
        pointToSnap,
        previousPoint,
        snapping.settings.angleSnapIncrement
      )
      
      // Only use angle snap if it's close enough to the current point
      const angleSnapDistance = Math.sqrt(
        Math.pow(angleSnapped.x - pointToSnap.x, 2) + 
        Math.pow(angleSnapped.y - pointToSnap.y, 2)
      )
      
      // If angle snap is within snap distance, use it (prioritize over other snaps)
      if (angleSnapDistance < snapping.settings.snapDistance) {
        // Add angle indicator
        if (snapping.settings.showSnapIndicators) {
          // Clear other indicators and add angle guide
          // Extend the guide line beyond the snapped point for better visibility
          const angle = getAngle(previousPoint, angleSnapped)
          const radians = (angle * Math.PI) / 180
          const extensionDistance = 50
          const extendedEnd = {
            x: angleSnapped.x + Math.cos(radians) * extensionDistance,
            y: angleSnapped.y + Math.sin(radians) * extensionDistance
          }
          
          const indicators: SnapIndicator[] = [{
            id: `angle-guide-${Date.now()}`,
            type: 'guide',
            geometry: {
              start: previousPoint,
              end: extendedEnd
            },
            style: {
              color: '#FF6600',
              width: 2,
              pattern: 'dashed'
            }
          }]
          
          return { 
            point: angleSnapped, 
            snapResult: {
              point: angleSnapped,
              type: 'guide',
              distance: angleSnapDistance,
              priority: 0 // Highest priority
            }, 
            indicators 
          }
        }
        
        return { 
          point: angleSnapped, 
          snapResult: {
            point: angleSnapped,
            type: 'guide',
            distance: angleSnapDistance,
            priority: 0
          }, 
          indicators: [] 
        }
      }
    }
    
    return result
  }, [getSnappedPoint, snapping.settings, snapping.temporaryDisabled])
  
  return {
    getSnappedPoint,
    getSnappedDrawingPoint,
    isSnappingEnabled: snapping.settings.enabled && !snapping.temporaryDisabled,
    snapSettings: snapping.settings
  }
}

// Helper function to get snap indicator color based on type
function getSnapColor(type: SnapResult['type']): string {
  switch (type) {
    case 'vertex':
      return '#FF0066'
    case 'edge-midpoint':
      return '#00FF66'
    case 'edge':
      return '#0066FF'
    case 'center':
      return '#FF6600'
    case 'grid':
      return '#666666'
    default:
      return '#0066FF'
  }
}

// Helper function to get snap indicator radius based on type
function getSnapRadius(type: SnapResult['type']): number {
  switch (type) {
    case 'vertex':
    case 'edge-midpoint':
      return 5
    case 'center':
      return 6
    case 'edge':
      return 4
    case 'grid':
      return 3
    default:
      return 4
  }
}