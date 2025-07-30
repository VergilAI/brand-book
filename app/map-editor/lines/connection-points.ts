import { Shape, ConnectionPoint, Point } from './types';

export function getDefaultConnectionPoints(shape: Shape): ConnectionPoint[] {
  const { position, size, id } = shape;
  const { x, y } = position;
  const { width, height } = size;
  
  return [
    {
      x: x + width / 2,
      y: y,
      shapeId: id,
      side: 'top',
      isDefault: true
    },
    {
      x: x + width,
      y: y + height / 2,
      shapeId: id,
      side: 'right',
      isDefault: true
    },
    {
      x: x + width / 2,
      y: y + height,
      shapeId: id,
      side: 'bottom',
      isDefault: true
    },
    {
      x: x,
      y: y + height / 2,
      shapeId: id,
      side: 'left',
      isDefault: true
    }
  ];
}

export function getNearestConnectionPoint(
  point: Point,
  shape: Shape,
  allowArbitrary: boolean = true
): ConnectionPoint {
  const defaultPoints = getDefaultConnectionPoints(shape);
  
  // Find nearest default point
  let nearest = defaultPoints[0];
  let minDistance = getDistance(point, nearest);
  
  for (const cp of defaultPoints) {
    const distance = getDistance(point, cp);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = cp;
    }
  }
  
  // If allowing arbitrary points and we're close to the shape edge
  if (allowArbitrary && minDistance > 20) {
    const edgePoint = getClosestPointOnShapeEdge(point, shape);
    if (edgePoint) {
      return {
        ...edgePoint,
        shapeId: shape.id,
        side: 'custom',
        isDefault: false
      };
    }
  }
  
  return nearest;
}

export function getClosestPointOnShapeEdge(point: Point, shape: Shape): Point | null {
  const { position, size } = shape;
  const { x, y } = position;
  const { width, height } = size;
  
  // For rectangle shapes, find closest point on perimeter
  const left = x;
  const right = x + width;
  const top = y;
  const bottom = y + height;
  
  // Clamp point to rectangle bounds
  const clampedX = Math.max(left, Math.min(right, point.x));
  const clampedY = Math.max(top, Math.min(bottom, point.y));
  
  // Determine which edge we're closest to
  const distToLeft = Math.abs(clampedX - left);
  const distToRight = Math.abs(clampedX - right);
  const distToTop = Math.abs(clampedY - top);
  const distToBottom = Math.abs(clampedY - bottom);
  
  const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
  
  if (minDist === distToLeft) {
    return { x: left, y: clampedY };
  } else if (minDist === distToRight) {
    return { x: right, y: clampedY };
  } else if (minDist === distToTop) {
    return { x: clampedX, y: top };
  } else {
    return { x: clampedX, y: bottom };
  }
}

export function getDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isPointNearShape(point: Point, shape: Shape, threshold: number = 50): boolean {
  const { position, size } = shape;
  const { x, y } = position;
  const { width, height } = size;
  
  const expandedBounds = {
    left: x - threshold,
    right: x + width + threshold,
    top: y - threshold,
    bottom: y + height + threshold
  };
  
  return point.x >= expandedBounds.left && 
         point.x <= expandedBounds.right && 
         point.y >= expandedBounds.top && 
         point.y <= expandedBounds.bottom;
}