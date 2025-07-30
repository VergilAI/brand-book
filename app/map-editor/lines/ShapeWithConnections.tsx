import React, { useState } from 'react';
import { Shape, ConnectionPoint } from './types';
import { getDefaultConnectionPoints } from './connection-points';

interface ShapeWithConnectionsProps {
  shape: Shape;
  isHovered: boolean;
  showConnectionPoints: boolean;
  onConnectionPointClick?: (point: ConnectionPoint) => void;
  onConnectionPointHover?: (point: ConnectionPoint | null) => void;
  highlightColor?: string;
}

export function ShapeWithConnections({
  shape,
  isHovered,
  showConnectionPoints,
  onConnectionPointClick,
  onConnectionPointHover,
  highlightColor
}: ShapeWithConnectionsProps) {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const connectionPoints = getDefaultConnectionPoints(shape);
  
  const handlePointMouseEnter = (point: ConnectionPoint) => {
    setHoveredPoint(`${point.shapeId}-${point.side}`);
    onConnectionPointHover?.(point);
  };
  
  const handlePointMouseLeave = () => {
    setHoveredPoint(null);
    onConnectionPointHover?.(null);
  };
  
  const { position, size, name } = shape;
  const fillColor = isHovered && highlightColor ? highlightColor : '#e5e7eb';
  const strokeColor = isHovered && highlightColor ? highlightColor : '#9ca3af';
  const strokeWidth = isHovered ? 2 : 1;
  
  return (
    <g className="shape-with-connections">
      {/* Shape */}
      <rect
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        rx={4}
        style={{ transition: 'all 0.2s ease' }}
      />
      
      {/* Shape label */}
      <text
        x={position.x + size.width / 2}
        y={position.y + size.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-medium select-none"
        fill="#374151"
      >
        {name}
      </text>
      
      {/* Connection points */}
      {showConnectionPoints && connectionPoints.map((point) => {
        const pointId = `${point.shapeId}-${point.side}`;
        const isPointHovered = hoveredPoint === pointId;
        
        return (
          <g key={pointId}>
            {/* Invisible larger hit area */}
            <circle
              cx={point.x}
              cy={point.y}
              r={10}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => handlePointMouseEnter(point)}
              onMouseLeave={handlePointMouseLeave}
              onClick={() => onConnectionPointClick?.(point)}
            />
            
            {/* Visible connection point */}
            <circle
              cx={point.x}
              cy={point.y}
              r={isPointHovered ? 5 : 3}
              fill={isPointHovered ? '#3b82f6' : '#6b7280'}
              stroke="white"
              strokeWidth={1}
              style={{ 
                pointerEvents: 'none',
                transition: 'all 0.15s ease'
              }}
            />
          </g>
        );
      })}
    </g>
  );
}