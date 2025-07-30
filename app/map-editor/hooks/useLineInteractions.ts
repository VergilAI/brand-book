import { useState, useCallback, useRef } from 'react';
import { Point } from '@/app/map-editor/lines/types';
import { TableRelationship } from '../types/database-types';

export interface LineWaypoint {
  id: string;
  x: number;
  y: number;
  type: 'start' | 'end' | 'corner' | 'control';
  constraints?: {
    axis?: 'x' | 'y';
    minValue?: number;
    maxValue?: number;
  };
}

export interface EnhancedRelationship extends TableRelationship {
  waypoints?: LineWaypoint[];
  lineType?: 'straight' | 'elbow' | 'curved';
}

interface UseLineInteractionsReturn {
  hoveredLineId: string | null;
  hoveredWaypointId: string | null;
  draggingWaypoint: { relationshipId: string; waypointId: string } | null;
  dragOffset: Point;
  handleLineHover: (lineId: string | null) => void;
  handleWaypointHover: (waypointId: string | null) => void;
  handleWaypointDragStart: (relationshipId: string, waypointId: string, startPoint: Point) => void;
  handleWaypointDrag: (currentPoint: Point) => void;
  handleWaypointDragEnd: () => void;
  generatePathData: (rel: EnhancedRelationship, fromPoint: Point, toPoint: Point, lineType: 'straight' | 'elbow' | 'curved') => string;
  generateWaypoints: (rel: EnhancedRelationship, fromPoint: Point, toPoint: Point, lineType: 'straight' | 'elbow' | 'curved') => LineWaypoint[];
}

export function useLineInteractions(): UseLineInteractionsReturn {
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const [hoveredWaypointId, setHoveredWaypointId] = useState<string | null>(null);
  const [draggingWaypoint, setDraggingWaypoint] = useState<{ relationshipId: string; waypointId: string } | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const dragStartPoint = useRef<Point>({ x: 0, y: 0 });

  const handleLineHover = useCallback((lineId: string | null) => {
    setHoveredLineId(lineId);
  }, []);

  const handleWaypointHover = useCallback((waypointId: string | null) => {
    setHoveredWaypointId(waypointId);
  }, []);

  const handleWaypointDragStart = useCallback((relationshipId: string, waypointId: string, startPoint: Point) => {
    setDraggingWaypoint({ relationshipId, waypointId });
    dragStartPoint.current = startPoint;
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleWaypointDrag = useCallback((currentPoint: Point) => {
    if (draggingWaypoint) {
      setDragOffset({
        x: currentPoint.x - dragStartPoint.current.x,
        y: currentPoint.y - dragStartPoint.current.y
      });
    }
  }, [draggingWaypoint]);

  const handleWaypointDragEnd = useCallback(() => {
    setDraggingWaypoint(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const generatePathData = useCallback((rel: EnhancedRelationship, fromPoint: Point, toPoint: Point, lineType: 'straight' | 'elbow' | 'curved'): string => {
    const type = rel.lineType || lineType;
    
    // For database relationships, we need perpendicular connections
    // Determine the direction based on the side of connection
    const fromSide = rel.fromSide || 'right';
    const toSide = rel.toSide || 'left';
    
    // Calculate perpendicular exit/entry distances
    const minPerpDistance = 30; // Minimum distance to move away from table before turning
    
    if (type === 'straight') {
      // Even for straight lines, add small perpendicular segments at the ends
      const fromOffsetX = fromSide === 'left' ? -minPerpDistance : minPerpDistance;
      const toOffsetX = toSide === 'left' ? -minPerpDistance : minPerpDistance;
      
      return `M ${fromPoint.x} ${fromPoint.y} L ${fromPoint.x + fromOffsetX} ${fromPoint.y} L ${toPoint.x + toOffsetX} ${toPoint.y} L ${toPoint.x} ${toPoint.y}`;
    } else if (type === 'curved') {
      // For curved lines, make control points extend perpendicularly first
      const fromOffsetX = fromSide === 'left' ? -100 : 100;
      const toOffsetX = toSide === 'left' ? -100 : 100;
      
      return `M ${fromPoint.x} ${fromPoint.y} C ${fromPoint.x + fromOffsetX} ${fromPoint.y}, ${toPoint.x + toOffsetX} ${toPoint.y}, ${toPoint.x} ${toPoint.y}`;
    } else {
      // Elbow (90-degree) path - the most common for database diagrams
      if (rel.waypoints && rel.waypoints.length > 2) {
        // Use existing waypoints if available, but always maintain perpendicular connections
        const fromOffsetX = fromSide === 'left' ? -minPerpDistance : minPerpDistance;
        const toOffsetX = toSide === 'left' ? -minPerpDistance : minPerpDistance;
        
        // Start with perpendicular segment from the connection point
        let path = `M ${fromPoint.x} ${fromPoint.y} L ${fromPoint.x + fromOffsetX} ${fromPoint.y}`;
        
        // Add intermediate waypoints
        rel.waypoints.forEach((wp, i) => {
          if (i > 0 && i < rel.waypoints!.length - 1) {
            // Apply drag offset if this waypoint is being dragged
            let x = wp.x;
            let y = wp.y;
            
            if (draggingWaypoint?.relationshipId === rel.id && draggingWaypoint?.waypointId === wp.id) {
              if (wp.constraints?.axis === 'x') {
                x += dragOffset.x;
              } else if (wp.constraints?.axis === 'y') {
                y += dragOffset.y;
              } else {
                x += dragOffset.x;
                y += dragOffset.y;
              }
            }
            
            path += ` L ${x} ${y}`;
          }
        });
        
        // End with perpendicular segment to the connection point
        path += ` L ${toPoint.x + toOffsetX} ${toPoint.y} L ${toPoint.x} ${toPoint.y}`;
        return path;
      } else {
        // Generate default elbow path with perpendicular connections
        const fromOffsetX = fromSide === 'left' ? -minPerpDistance : minPerpDistance;
        const toOffsetX = toSide === 'left' ? -minPerpDistance : minPerpDistance;
        
        const fromPerp = { x: fromPoint.x + fromOffsetX, y: fromPoint.y };
        const toPerp = { x: toPoint.x + toOffsetX, y: toPoint.y };
        
        // Smart routing to avoid overlaps
        if (fromSide === 'right' && toSide === 'left' && fromPerp.x < toPerp.x) {
          // Simple horizontal connection
          const midX = (fromPerp.x + toPerp.x) / 2;
          return `M ${fromPoint.x} ${fromPoint.y} L ${fromPerp.x} ${fromPerp.y} L ${midX} ${fromPerp.y} L ${midX} ${toPerp.y} L ${toPerp.x} ${toPerp.y} L ${toPoint.x} ${toPoint.y}`;
        } else if (fromSide === 'left' && toSide === 'right' && fromPerp.x > toPerp.x) {
          // Simple horizontal connection (opposite direction)
          const midX = (fromPerp.x + toPerp.x) / 2;
          return `M ${fromPoint.x} ${fromPoint.y} L ${fromPerp.x} ${fromPerp.y} L ${midX} ${fromPerp.y} L ${midX} ${toPerp.y} L ${toPerp.x} ${toPerp.y} L ${toPoint.x} ${toPoint.y}`;
        } else {
          // Need to route around - use a rectangular path
          const extendDistance = Math.max(Math.abs(toPoint.x - fromPoint.x) / 2, 50);
          const fromExtX = fromSide === 'left' ? fromPoint.x - extendDistance : fromPoint.x + extendDistance;
          const toExtX = toSide === 'left' ? toPoint.x - extendDistance : toPoint.x + extendDistance;
          
          return `M ${fromPoint.x} ${fromPoint.y} L ${fromExtX} ${fromPoint.y} L ${fromExtX} ${toPoint.y} L ${toPoint.x} ${toPoint.y}`;
        }
      }
    }
  }, [draggingWaypoint, dragOffset]);

  const generateWaypoints = useCallback((rel: EnhancedRelationship, fromPoint: Point, toPoint: Point, lineType: 'straight' | 'elbow' | 'curved'): LineWaypoint[] => {
    const type = rel.lineType || lineType;
    
    if (type === 'straight' || type === 'curved') {
      return [
        { id: `${rel.id}-wp-start`, x: fromPoint.x, y: fromPoint.y, type: 'start' },
        { id: `${rel.id}-wp-end`, x: toPoint.x, y: toPoint.y, type: 'end' }
      ];
    } else {
      // Elbow path waypoints
      if (rel.waypoints) {
        return rel.waypoints;
      }
      
      // Generate default waypoints with perpendicular connections
      const fromSide = rel.fromSide || 'right';
      const toSide = rel.toSide || 'left';
      const minPerpDistance = 30;
      
      const fromOffsetX = fromSide === 'left' ? -minPerpDistance : minPerpDistance;
      const toOffsetX = toSide === 'left' ? -minPerpDistance : minPerpDistance;
      
      const fromPerp = { x: fromPoint.x + fromOffsetX, y: fromPoint.y };
      const toPerp = { x: toPoint.x + toOffsetX, y: toPoint.y };
      
      const waypoints: LineWaypoint[] = [
        { id: `${rel.id}-wp-start`, x: fromPoint.x, y: fromPoint.y, type: 'start' },
        { id: `${rel.id}-wp-perp-start`, x: fromPerp.x, y: fromPerp.y, type: 'corner' } // First perpendicular segment
      ];
      
      // Smart routing based on connection sides
      if (fromSide === 'right' && toSide === 'left' && fromPerp.x < toPerp.x) {
        // Simple horizontal connection
        const midX = (fromPerp.x + toPerp.x) / 2;
        waypoints.push(
          { id: `${rel.id}-wp-1`, x: midX, y: fromPerp.y, type: 'corner', constraints: { axis: 'x' } },
          { id: `${rel.id}-wp-2`, x: midX, y: toPerp.y, type: 'corner', constraints: { axis: 'x' } }
        );
      } else if (fromSide === 'left' && toSide === 'right' && fromPerp.x > toPerp.x) {
        // Simple horizontal connection (opposite direction)
        const midX = (fromPerp.x + toPerp.x) / 2;
        waypoints.push(
          { id: `${rel.id}-wp-1`, x: midX, y: fromPerp.y, type: 'corner', constraints: { axis: 'x' } },
          { id: `${rel.id}-wp-2`, x: midX, y: toPerp.y, type: 'corner', constraints: { axis: 'x' } }
        );
      } else {
        // Need to route around
        const extendDistance = Math.max(Math.abs(toPoint.x - fromPoint.x) / 2, 50);
        const fromExtX = fromSide === 'left' ? fromPoint.x - extendDistance : fromPoint.x + extendDistance;
        const toExtX = toSide === 'left' ? toPoint.x - extendDistance : toPoint.x + extendDistance;
        waypoints.push(
          { id: `${rel.id}-wp-1`, x: fromExtX, y: fromPoint.y, type: 'corner', constraints: { axis: 'x' } },
          { id: `${rel.id}-wp-2`, x: fromExtX, y: toPoint.y, type: 'corner', constraints: { axis: 'x' } }
        );
      }
      
      waypoints.push(
        { id: `${rel.id}-wp-perp-end`, x: toPerp.x, y: toPerp.y, type: 'corner' }, // Last perpendicular segment
        { id: `${rel.id}-wp-end`, x: toPoint.x, y: toPoint.y, type: 'end' }
      );
      return waypoints;
    }
  }, []);

  return {
    hoveredLineId,
    hoveredWaypointId,
    draggingWaypoint,
    dragOffset,
    handleLineHover,
    handleWaypointHover,
    handleWaypointDragStart,
    handleWaypointDrag,
    handleWaypointDragEnd,
    generatePathData,
    generateWaypoints
  };
}