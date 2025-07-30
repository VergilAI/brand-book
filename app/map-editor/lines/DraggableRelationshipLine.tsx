import React, { useState } from 'react';
import { DraggableRelationshipPath, LineInteractionState } from './types';
import { updatePathAfterDrag } from './path-generator';

interface DraggableRelationshipLineProps {
  path: DraggableRelationshipPath;
  onPathUpdate: (path: DraggableRelationshipPath) => void;
  isSelected: boolean;
  strokeWidth?: number;
  color?: string;
}

export function DraggableRelationshipLine({
  path,
  onPathUpdate,
  isSelected,
  strokeWidth = 2,
  color = '#666'
}: DraggableRelationshipLineProps) {
  const [interactionState, setInteractionState] = useState<LineInteractionState>({
    hoveredSegmentId: null,
    draggingSegmentId: null,
    dragStartPosition: null,
    dragOffset: 0
  });

  const handleSegmentMouseDown = (segmentId: string, e: React.MouseEvent) => {
    const segment = path.segments.find(s => s.id === segmentId);
    if (!segment?.isDraggable) return;

    e.stopPropagation();
    
    setInteractionState({
      ...interactionState,
      draggingSegmentId: segmentId,
      dragStartPosition: { x: e.clientX, y: e.clientY },
      dragOffset: 0
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!interactionState.draggingSegmentId || !interactionState.dragStartPosition) return;

    const segment = path.segments.find(s => s.id === interactionState.draggingSegmentId);
    if (!segment) return;

    let dragOffset = 0;
    if (segment.orientation === 'vertical') {
      // Vertical segments move horizontally
      dragOffset = e.clientX - interactionState.dragStartPosition.x;
    } else {
      // Horizontal segments move vertically
      dragOffset = e.clientY - interactionState.dragStartPosition.y;
    }

    setInteractionState({
      ...interactionState,
      dragOffset
    });
  };

  const handleMouseUp = () => {
    if (interactionState.draggingSegmentId && interactionState.dragOffset !== 0) {
      const updatedPath = updatePathAfterDrag(
        path,
        interactionState.draggingSegmentId,
        interactionState.dragOffset
      );
      onPathUpdate(updatedPath);
    }

    setInteractionState({
      hoveredSegmentId: null,
      draggingSegmentId: null,
      dragStartPosition: null,
      dragOffset: 0
    });
  };

  React.useEffect(() => {
    if (interactionState.draggingSegmentId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [interactionState.draggingSegmentId, interactionState.dragStartPosition]);

  const getSegmentPath = (segment: typeof path.segments[0]) => {
    let start = segment.startPoint;
    let end = segment.endPoint;

    // Apply drag offset if this segment is being dragged
    if (segment.id === interactionState.draggingSegmentId) {
      if (segment.orientation === 'vertical') {
        start = { x: start.x + interactionState.dragOffset, y: start.y };
        end = { x: end.x + interactionState.dragOffset, y: end.y };
      } else {
        start = { x: start.x, y: start.y + interactionState.dragOffset };
        end = { x: end.x, y: end.y + interactionState.dragOffset };
      }
    }

    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  };

  return (
    <g className="draggable-relationship-line">
      {path.segments.map((segment) => (
        <g key={segment.id}>
          {/* Invisible wider hit area for easier interaction */}
          {segment.isDraggable && (
            <path
              d={getSegmentPath(segment)}
              stroke="transparent"
              strokeWidth={20}
              style={{ cursor: 'move' }}
              onMouseDown={(e) => handleSegmentMouseDown(segment.id, e)}
              onMouseEnter={() => setInteractionState({ ...interactionState, hoveredSegmentId: segment.id })}
              onMouseLeave={() => setInteractionState({ ...interactionState, hoveredSegmentId: null })}
            />
          )}
          
          {/* Visible line */}
          <path
            d={getSegmentPath(segment)}
            stroke={color}
            strokeWidth={
              segment.id === interactionState.hoveredSegmentId || 
              segment.id === interactionState.draggingSegmentId
                ? strokeWidth + 1
                : strokeWidth
            }
            fill="none"
            style={{
              pointerEvents: segment.isDraggable ? 'none' : 'auto',
              opacity: 
                segment.id === interactionState.draggingSegmentId ? 0.7 :
                segment.id === interactionState.hoveredSegmentId ? 0.8 : 1
            }}
          />
          
          {/* Drag handle indicator */}
          {segment.isDraggable && (segment.id === interactionState.hoveredSegmentId || segment.id === interactionState.draggingSegmentId) && (
            <circle
              cx={(segment.startPoint.x + segment.endPoint.x) / 2}
              cy={(segment.startPoint.y + segment.endPoint.y) / 2}
              r={4}
              fill={color}
              style={{ pointerEvents: 'none' }}
            />
          )}
        </g>
      ))}
    </g>
  );
}