import { LineSegment, DraggableRelationshipPath } from './types';

export interface ConnectionPoint {
  x: number;
  y: number;
  side: 'left' | 'right';
}

export function generateDefaultPath(
  from: ConnectionPoint,
  to: ConnectionPoint,
  relationshipId: string
): DraggableRelationshipPath {
  const segments: LineSegment[] = [];
  
  // Calculate midpoint X based on the sides
  const midX = (from.x + to.x) / 2;
  
  // Generate 3 segments: horizontal -> vertical -> horizontal
  
  // Segment 1: Horizontal from start point
  segments.push({
    id: `${relationshipId}-seg-1`,
    startPoint: { x: from.x, y: from.y },
    endPoint: { x: midX, y: from.y },
    orientation: 'horizontal',
    isDraggable: false // End segments typically not draggable
  });
  
  // Segment 2: Vertical (this is the draggable part)
  segments.push({
    id: `${relationshipId}-seg-2`,
    startPoint: { x: midX, y: from.y },
    endPoint: { x: midX, y: to.y },
    orientation: 'vertical',
    isDraggable: true
  });
  
  // Segment 3: Horizontal to end point
  segments.push({
    id: `${relationshipId}-seg-3`,
    startPoint: { x: midX, y: to.y },
    endPoint: { x: to.x, y: to.y },
    orientation: 'horizontal',
    isDraggable: false
  });
  
  // Generate waypoints (the corners)
  const waypoints = [
    { x: from.x, y: from.y },
    { x: midX, y: from.y },
    { x: midX, y: to.y },
    { x: to.x, y: to.y }
  ];
  
  return {
    relationshipId,
    segments,
    waypoints,
    isEditing: false
  };
}

export function updatePathAfterDrag(
  path: DraggableRelationshipPath,
  segmentId: string,
  dragOffset: number
): DraggableRelationshipPath {
  const segmentIndex = path.segments.findIndex(s => s.id === segmentId);
  if (segmentIndex === -1) return path;
  
  const segment = path.segments[segmentIndex];
  const newSegments = [...path.segments];
  const newWaypoints = [...path.waypoints];
  
  if (segment.orientation === 'vertical') {
    // Dragging vertical segment horizontally
    const newX = segment.startPoint.x + dragOffset;
    
    // Update the vertical segment
    newSegments[segmentIndex] = {
      ...segment,
      startPoint: { x: newX, y: segment.startPoint.y },
      endPoint: { x: newX, y: segment.endPoint.y }
    };
    
    // Update adjacent horizontal segments
    if (segmentIndex > 0) {
      newSegments[segmentIndex - 1] = {
        ...newSegments[segmentIndex - 1],
        endPoint: { x: newX, y: newSegments[segmentIndex - 1].endPoint.y }
      };
    }
    
    if (segmentIndex < newSegments.length - 1) {
      newSegments[segmentIndex + 1] = {
        ...newSegments[segmentIndex + 1],
        startPoint: { x: newX, y: newSegments[segmentIndex + 1].startPoint.y }
      };
    }
    
    // Update waypoints
    newWaypoints[segmentIndex] = { x: newX, y: newWaypoints[segmentIndex].y };
    newWaypoints[segmentIndex + 1] = { x: newX, y: newWaypoints[segmentIndex + 1].y };
  }
  
  // Similar logic would apply for horizontal segments dragged vertically
  
  return {
    ...path,
    segments: newSegments,
    waypoints: newWaypoints
  };
}