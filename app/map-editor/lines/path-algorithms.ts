import { Point, LinePath, Waypoint, LineSegment, Shape, ConnectionPoint } from './types';

export function generateStraightPath(start: Point, end: Point, lineId: string): Partial<LinePath> {
  const segments: LineSegment[] = [{
    id: `${lineId}-seg-1`,
    startPoint: start,
    endPoint: end,
    isDraggable: false
  }];
  
  const waypoints: Waypoint[] = [
    { ...start, id: `${lineId}-wp-start`, type: 'control' },
    { ...end, id: `${lineId}-wp-end`, type: 'control' }
  ];
  
  return { segments, waypoints };
}

export function generateElbowPath(
  start: Point, 
  end: Point, 
  lineId: string,
  startSide?: 'top' | 'right' | 'bottom' | 'left',
  endSide?: 'top' | 'right' | 'bottom' | 'left'
): Partial<LinePath> {
  const segments: LineSegment[] = [];
  const waypoints: Waypoint[] = [];
  
  // Start waypoint
  waypoints.push({ ...start, id: `${lineId}-wp-start`, type: 'control' });
  
  // Calculate intermediate points based on connection sides
  const points = calculateElbowPoints(start, end, startSide, endSide);
  
  // Create segments and waypoints
  for (let i = 0; i < points.length - 1; i++) {
    segments.push({
      id: `${lineId}-seg-${i + 1}`,
      startPoint: points[i],
      endPoint: points[i + 1],
      orientation: i % 2 === 0 ? 'horizontal' : 'vertical',
      isDraggable: i === Math.floor(points.length / 2) - 1
    });
    
    if (i > 0 && i < points.length - 1) {
      waypoints.push({
        ...points[i],
        id: `${lineId}-wp-${i}`,
        type: 'corner',
        constraints: {
          axis: i % 2 === 0 ? 'x' : 'y'
        }
      });
    }
  }
  
  // End waypoint
  waypoints.push({ ...end, id: `${lineId}-wp-end`, type: 'control' });
  
  return { segments, waypoints };
}

export function generateCurvedPath(start: Point, end: Point, lineId: string): Partial<LinePath> {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const controlOffset = Math.abs(end.x - start.x) * 0.5;
  
  const waypoints: Waypoint[] = [
    { ...start, id: `${lineId}-wp-start`, type: 'control' },
    { 
      x: midX - controlOffset, 
      y: midY, 
      id: `${lineId}-wp-control1`, 
      type: 'control' 
    },
    { 
      x: midX + controlOffset, 
      y: midY, 
      id: `${lineId}-wp-control2`, 
      type: 'control' 
    },
    { ...end, id: `${lineId}-wp-end`, type: 'control' }
  ];
  
  // For curved paths, we don't use segments in the same way
  const segments: LineSegment[] = [{
    id: `${lineId}-seg-1`,
    startPoint: start,
    endPoint: end,
    isDraggable: false
  }];
  
  return { segments, waypoints };
}

function calculateElbowPoints(
  start: Point,
  end: Point,
  startSide?: 'top' | 'right' | 'bottom' | 'left',
  endSide?: 'top' | 'right' | 'bottom' | 'left'
): Point[] {
  const points: Point[] = [start];
  
  // Simple 3-segment path for now
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  if (Math.abs(end.y - start.y) > Math.abs(end.x - start.x)) {
    // Vertical dominant
    points.push({ x: start.x, y: midY });
    points.push({ x: end.x, y: midY });
  } else {
    // Horizontal dominant
    points.push({ x: midX, y: start.y });
    points.push({ x: midX, y: end.y });
  }
  
  points.push(end);
  return points;
}

export function findOptimalPath(
  start: ConnectionPoint,
  end: ConnectionPoint,
  obstacles: Shape[],
  lineType: 'elbow' | 'straight' = 'elbow'
): Point[] {
  if (lineType === 'straight') {
    return [start, end];
  }
  
  // Simplified pathfinding - in real implementation would use A* or similar
  return calculateElbowPoints(start, end, start.side, end.side);
}

export function recalculatePathWithObstacles(
  path: LinePath,
  obstacles: Shape[]
): LinePath {
  // Simplified - would implement collision detection and rerouting
  return path;
}