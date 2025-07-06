"use client"

import { useCallback, useMemo } from 'react'
import { useMapEditor } from './useMapEditor'
import type { Point } from '@/lib/lms/optimized-map-data'
import type { SnapResult, SnapIndicator } from '../types/snapping'
import { getSnapCandidates, getAlignmentGuides, snapPointToAngle } from '../utils/snapping'

export function useSnapping() {
  const store = useMapEditor()
  const { snapping, view, map, editing } = store
  
  // Get the territory being edited (if any) to exclude from snapping
  const excludeTerritoryId = editing.isEditing ? editing.editingTerritoryId : undefined
  
  // Get snap point with all snap types considered
  const getSnappedPoint = useCallback((point: Point, excludeTerritoryIds?: string | string[]): { point: Point; snapResult: SnapResult | null; indicators: SnapIndicator[] } => {
    // If snapping is disabled or temporarily disabled, return original point
    if (!snapping.settings.enabled || snapping.temporaryDisabled) {
      return { point, snapResult: null, indicators: [] }
    }
    
    const territories = Object.values(map.territories)
    const indicators: SnapIndicator[] = []
    
    // Handle both single and multiple excluded IDs
    const excludeId = Array.isArray(excludeTerritoryIds) ? undefined : excludeTerritoryIds
    const excludeIds = Array.isArray(excludeTerritoryIds) ? excludeTerritoryIds : (excludeTerritoryIds ? [excludeTerritoryIds] : [])
    
    // Filter territories if multiple IDs to exclude
    const filteredTerritories = excludeIds.length > 0 
      ? territories.filter(t => !excludeIds.includes(t.id))
      : territories
    
    // Get snap candidates
    const candidates = getSnapCandidates(
      point,
      filteredTerritories,
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
      const { guides, alignedElements } = getAlignmentGuides(snappedPoint, filteredTerritories, 5)
      
      // Add guide lines
      guides.forEach((guide, index) => {
        indicators.push({
          id: `guide-${Date.now()}-${index}`,
          type: 'guide',
          geometry: guide,
          style: {
            color: 'var(--color-blue-400)', // blue 400
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
              color: 'var(--color-blue-400)', // blue 400
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
              color: 'var(--color-yellow-600)', // yellow 600
              width: 2,
              radius: 8
            }
          })
        }
      })
    }
    
    return { point: snappedPoint, snapResult, indicators }
  }, [snapping, map.territories, view.gridSize, excludeTerritoryId])
  
  // Get snapped point for drawing with angle snap
  const getSnappedDrawingPoint = useCallback((point: Point, previousPoint?: Point): { point: Point; snapResult: SnapResult | null; indicators: SnapIndicator[] } => {
    // First apply regular snapping
    const result = getSnappedPoint(point)
    
    // If angle snapping is enabled and we have a previous point
    if (snapping.settings.angleSnap && previousPoint && !result.snapResult) {
      const angleSnapped = snapPointToAngle(
        result.point,
        previousPoint,
        snapping.settings.angleSnapIncrement
      )
      
      // Add angle indicator
      if (snapping.settings.showSnapIndicators) {
        result.indicators.push({
          id: `angle-guide-${Date.now()}`,
          type: 'guide',
          geometry: {
            start: previousPoint,
            end: angleSnapped
          },
          style: {
            color: 'var(--color-yellow-600)', // yellow 600
            width: 1,
            pattern: 'dashed'
          }
        })
      }
      
      return { 
        point: angleSnapped, 
        snapResult: null, 
        indicators: result.indicators 
      }
    }
    
    return result
  }, [getSnappedPoint, snapping.settings])
  
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
      return 'var(--color-red-400)' // red 400
    case 'edge-midpoint':
      return 'var(--color-green-400)' // green 400
    case 'edge':
      return 'var(--color-blue-400)' // blue 400
    case 'center':
      return 'var(--color-yellow-600)' // yellow 600
    case 'grid':
      return 'var(--color-gray-300)' // gray 300
    default:
      return 'var(--color-blue-400)' // blue 400
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