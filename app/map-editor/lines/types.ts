export type LineType = 'straight' | 'elbow' | 'curved';
export type ConnectionMode = 'smart' | 'manual';

export interface Point {
  x: number;
  y: number;
}

export interface ConnectionPoint extends Point {
  shapeId: string;
  side: 'top' | 'right' | 'bottom' | 'left' | 'custom';
  isDefault: boolean;
}

export interface LineSegment {
  id: string;
  startPoint: Point;
  endPoint: Point;
  orientation?: 'horizontal' | 'vertical';
  isDraggable: boolean;
}

export interface Waypoint extends Point {
  id: string;
  type: 'corner' | 'control' | 'midpoint';
  constraints?: {
    axis?: 'x' | 'y';
    minValue?: number;
    maxValue?: number;
  };
}

export interface LinePath {
  id: string;
  type: LineType;
  mode: ConnectionMode;
  startConnection?: ConnectionPoint;
  endConnection?: ConnectionPoint;
  waypoints: Waypoint[];
  segments: LineSegment[];
  style: LineStyle;
  isSelected: boolean;
  isHovered: boolean;
}

export interface LineStyle {
  color: string;
  width: number;
  pattern: 'solid' | 'dashed' | 'dotted';
  startArrow?: ArrowStyle;
  endArrow?: ArrowStyle;
  showJumps: boolean;
}

export interface ArrowStyle {
  type: 'none' | 'arrow' | 'circle' | 'diamond';
  filled: boolean;
}

export interface LineInteractionState {
  hoveredSegmentId: string | null;
  hoveredWaypointId: string | null;
  draggingItem: {
    type: 'segment' | 'waypoint' | 'endpoint';
    id: string;
  } | null;
  dragStartPosition: Point | null;
  dragOffset: Point;
  connectionMode: ConnectionMode;
  isCreatingLine: boolean;
  createStartPoint: Point | null;
}

export interface Shape {
  id: string;
  type: 'table' | 'rect' | 'circle';
  position: Point;
  size: { width: number; height: number };
  name: string;
  connectionPoints?: ConnectionPoint[];
}