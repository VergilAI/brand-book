import React from 'react';
import { LinePath, LineStyle, ArrowStyle, Point } from './types';

interface LineRendererProps {
  path: LinePath;
  onLineClick?: (lineId: string) => void;
  onWaypointMouseDown?: (waypointId: string, event: React.MouseEvent) => void;
  showWaypoints?: boolean;
}

export function LineRenderer({ 
  path, 
  onLineClick, 
  onWaypointMouseDown,
  showWaypoints = false 
}: LineRendererProps) {
  const { style, type, waypoints, isSelected, isHovered } = path;
  
  const getPathData = (): string => {
    if (waypoints.length < 2) return '';
    
    if (type === 'straight') {
      return `M ${waypoints[0].x} ${waypoints[0].y} L ${waypoints[waypoints.length - 1].x} ${waypoints[waypoints.length - 1].y}`;
    } else if (type === 'elbow') {
      let pathData = `M ${waypoints[0].x} ${waypoints[0].y}`;
      for (let i = 1; i < waypoints.length; i++) {
        pathData += ` L ${waypoints[i].x} ${waypoints[i].y}`;
      }
      return pathData;
    } else if (type === 'curved') {
      // Bezier curve through control points
      if (waypoints.length === 4) {
        return `M ${waypoints[0].x} ${waypoints[0].y} C ${waypoints[1].x} ${waypoints[1].y}, ${waypoints[2].x} ${waypoints[2].y}, ${waypoints[3].x} ${waypoints[3].y}`;
      }
      // Fallback to straight line
      return `M ${waypoints[0].x} ${waypoints[0].y} L ${waypoints[waypoints.length - 1].x} ${waypoints[waypoints.length - 1].y}`;
    }
    
    return '';
  };
  
  const getStrokeDasharray = (): string | undefined => {
    switch (style.pattern) {
      case 'dashed':
        return '8 4';
      case 'dotted':
        return '2 4';
      default:
        return undefined;
    }
  };
  
  const renderArrow = (point: Point, arrowStyle: ArrowStyle, rotation: number) => {
    if (arrowStyle.type === 'none') return null;
    
    const size = 10;
    const transform = `translate(${point.x}, ${point.y}) rotate(${rotation})`;
    
    switch (arrowStyle.type) {
      case 'arrow':
        return (
          <path
            d={`M ${-size} ${-size/2} L 0 0 L ${-size} ${size/2} ${arrowStyle.filled ? 'Z' : ''}`}
            fill={arrowStyle.filled ? style.color : 'none'}
            stroke={style.color}
            strokeWidth={1}
            transform={transform}
          />
        );
      case 'circle':
        return (
          <circle
            cx={point.x}
            cy={point.y}
            r={size/2}
            fill={arrowStyle.filled ? style.color : 'white'}
            stroke={style.color}
            strokeWidth={1}
          />
        );
      case 'diamond':
        return (
          <path
            d={`M 0 ${-size/2} L ${size/2} 0 L 0 ${size/2} L ${-size/2} 0 Z`}
            fill={arrowStyle.filled ? style.color : 'white'}
            stroke={style.color}
            strokeWidth={1}
            transform={transform}
          />
        );
      default:
        return null;
    }
  };
  
  const calculateArrowRotation = (start: Point, end: Point): number => {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    return angle * 180 / Math.PI;
  };
  
  const effectiveWidth = isHovered ? style.width + 1 : style.width;
  const effectiveOpacity = isSelected ? 1 : 0.8;
  
  return (
    <g className="line-renderer">
      {/* Invisible wider hit area */}
      <path
        d={getPathData()}
        stroke="transparent"
        strokeWidth={Math.max(20, style.width * 3)}
        fill="none"
        style={{ cursor: 'pointer' }}
        onClick={() => onLineClick?.(path.id)}
      />
      
      {/* Visible line */}
      <path
        d={getPathData()}
        stroke={style.color}
        strokeWidth={effectiveWidth}
        strokeDasharray={getStrokeDasharray()}
        fill="none"
        opacity={effectiveOpacity}
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Arrows */}
      {style.startArrow && waypoints.length >= 2 && 
        renderArrow(
          waypoints[0],
          style.startArrow,
          calculateArrowRotation(waypoints[1], waypoints[0])
        )
      }
      {style.endArrow && waypoints.length >= 2 &&
        renderArrow(
          waypoints[waypoints.length - 1],
          style.endArrow,
          calculateArrowRotation(waypoints[waypoints.length - 2], waypoints[waypoints.length - 1])
        )
      }
      
      {/* Waypoints (for editing) */}
      {showWaypoints && (isSelected || isHovered) && waypoints.map((wp, index) => {
        // Don't show endpoints if connected to shapes
        if ((index === 0 && path.startConnection) || 
            (index === waypoints.length - 1 && path.endConnection)) {
          return null;
        }
        
        return (
          <circle
            key={wp.id}
            cx={wp.x}
            cy={wp.y}
            r={5}
            fill="white"
            stroke={style.color}
            strokeWidth={2}
            style={{ cursor: 'move' }}
            onMouseDown={(e) => onWaypointMouseDown?.(wp.id, e)}
          />
        );
      })}
    </g>
  );
}