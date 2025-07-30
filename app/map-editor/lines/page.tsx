"use client"

import React, { useState, useRef, useEffect } from 'react';
import { LineRenderer } from './LineRenderer';
import { ShapeWithConnections } from './ShapeWithConnections';
import { 
  LinePath, 
  Shape, 
  LineType, 
  ConnectionMode,
  Point,
  ConnectionPoint,
  LineStyle,
  LineInteractionState
} from './types';
import { 
  generateStraightPath, 
  generateElbowPath, 
  generateCurvedPath 
} from './path-algorithms';
import { getNearestConnectionPoint, isPointNearShape } from './connection-points';

export default function LinesTestPage() {
  // Shapes (tables/nodes)
  const [shapes] = useState<Shape[]>([
    { id: 'shape1', type: 'table', position: { x: 100, y: 100 }, size: { width: 120, height: 80 }, name: 'Users' },
    { id: 'shape2', type: 'table', position: { x: 400, y: 100 }, size: { width: 120, height: 80 }, name: 'Orders' },
    { id: 'shape3', type: 'table', position: { x: 100, y: 300 }, size: { width: 120, height: 80 }, name: 'Products' },
    { id: 'shape4', type: 'table', position: { x: 400, y: 300 }, size: { width: 120, height: 80 }, name: 'Categories' },
    { id: 'shape5', type: 'table', position: { x: 250, y: 450 }, size: { width: 120, height: 80 }, name: 'Inventory' }
  ]);

  // Lines
  const [lines, setLines] = useState<LinePath[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
  
  // Line creation state
  const [lineType, setLineType] = useState<LineType>('elbow');
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('smart');
  const [defaultLineStyle] = useState<LineStyle>({
    color: '#6b7280',
    width: 2,
    pattern: 'solid',
    endArrow: { type: 'arrow', filled: true },
    showJumps: false
  });
  
  // Interaction state
  const [interactionState, setInteractionState] = useState<LineInteractionState>({
    hoveredSegmentId: null,
    hoveredWaypointId: null,
    draggingItem: null,
    dragStartPosition: null,
    dragOffset: { x: 0, y: 0 },
    connectionMode: 'smart',
    isCreatingLine: false,
    createStartPoint: null
  });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgPoint, setSvgPoint] = useState<Point>({ x: 0, y: 0 });
  const [tempLine, setTempLine] = useState<Partial<LinePath> | null>(null);
  const [pendingConnection, setPendingConnection] = useState<{
    startPoint: ConnectionPoint;
    timer: NodeJS.Timeout | null;
  } | null>(null);

  // Convert mouse coordinates to SVG coordinates
  const getSVGPoint = (e: React.MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  // Handle connection point click (start line creation)
  const handleConnectionPointClick = (point: ConnectionPoint) => {
    if (!interactionState.isCreatingLine) {
      setInteractionState({
        ...interactionState,
        isCreatingLine: true,
        createStartPoint: point
      });
    }
  };

  // Handle SVG mouse move during line creation
  const handleSVGMouseMove = (e: React.MouseEvent) => {
    const point = getSVGPoint(e);
    setSvgPoint(point);
    
    if (interactionState.isCreatingLine && interactionState.createStartPoint) {
      // Check if near a shape for smart connection
      let endPoint: Point = point;
      let endConnection: ConnectionPoint | undefined;
      
      for (const shape of shapes) {
        if (isPointNearShape(point, shape, 30)) {
          const nearestPoint = getNearestConnectionPoint(point, shape);
          endPoint = nearestPoint;
          endConnection = nearestPoint;
          
          // Start hover timer for smart connection
          if (!pendingConnection || pendingConnection.startPoint.shapeId !== shape.id) {
            if (pendingConnection?.timer) {
              clearTimeout(pendingConnection.timer);
            }
            
            const timer = setTimeout(() => {
              setHoveredShapeId(shape.id);
            }, 500);
            
            setPendingConnection({ startPoint: nearestPoint, timer });
          }
          break;
        }
      }
      
      // Generate temporary line preview
      let pathData: Partial<LinePath>;
      
      switch (lineType) {
        case 'straight':
          pathData = generateStraightPath(interactionState.createStartPoint, endPoint, 'temp');
          break;
        case 'curved':
          pathData = generateCurvedPath(interactionState.createStartPoint, endPoint, 'temp');
          break;
        default:
          pathData = generateElbowPath(
            interactionState.createStartPoint, 
            endPoint, 
            'temp',
            interactionState.createStartPoint.side,
            endConnection?.side
          );
      }
      
      setTempLine({
        ...pathData,
        id: 'temp',
        type: lineType,
        mode: connectionMode,
        style: defaultLineStyle,
        isSelected: false,
        isHovered: false,
        startConnection: interactionState.createStartPoint,
        endConnection
      } as LinePath);
    }
  };

  // Handle SVG click (complete line creation)
  const handleSVGClick = (e: React.MouseEvent) => {
    const point = getSVGPoint(e);
    
    if (interactionState.isCreatingLine && interactionState.createStartPoint) {
      // Find if we clicked on a connection point
      let endPoint: Point = point;
      let endConnection: ConnectionPoint | undefined;
      
      for (const shape of shapes) {
        if (isPointNearShape(point, shape, 30)) {
          const nearestPoint = getNearestConnectionPoint(point, shape);
          endPoint = nearestPoint;
          endConnection = nearestPoint;
          break;
        }
      }
      
      // Create the line
      const lineId = `line-${Date.now()}`;
      let pathData: Partial<LinePath>;
      
      switch (lineType) {
        case 'straight':
          pathData = generateStraightPath(interactionState.createStartPoint, endPoint, lineId);
          break;
        case 'curved':
          pathData = generateCurvedPath(interactionState.createStartPoint, endPoint, lineId);
          break;
        default:
          pathData = generateElbowPath(
            interactionState.createStartPoint, 
            endPoint, 
            lineId,
            interactionState.createStartPoint.side,
            endConnection?.side
          );
      }
      
      const newLine: LinePath = {
        ...pathData,
        id: lineId,
        type: lineType,
        mode: connectionMode,
        style: defaultLineStyle,
        isSelected: false,
        isHovered: false,
        startConnection: interactionState.createStartPoint,
        endConnection
      } as LinePath;
      
      setLines([...lines, newLine]);
      setTempLine(null);
      setInteractionState({
        ...interactionState,
        isCreatingLine: false,
        createStartPoint: null
      });
      setHoveredShapeId(null);
      
      if (pendingConnection?.timer) {
        clearTimeout(pendingConnection.timer);
        setPendingConnection(null);
      }
    }
  };

  // Handle line selection
  const handleLineClick = (lineId: string) => {
    setSelectedLineId(lineId);
    setLines(lines.map(line => ({
      ...line,
      isSelected: line.id === lineId
    })));
  };

  // Handle waypoint dragging
  const handleWaypointMouseDown = (waypointId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const point = getSVGPoint(e);
    setInteractionState({
      ...interactionState,
      draggingItem: { type: 'waypoint', id: waypointId },
      dragStartPosition: point,
      dragOffset: { x: 0, y: 0 }
    });
  };

  // Global mouse handlers for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (interactionState.draggingItem && interactionState.dragStartPosition) {
        const currentPoint = { x: e.clientX, y: e.clientY };
        const offset = {
          x: currentPoint.x - interactionState.dragStartPosition.x,
          y: currentPoint.y - interactionState.dragStartPosition.y
        };
        
        // Update dragged waypoint position
        if (interactionState.draggingItem.type === 'waypoint') {
          const waypointId = interactionState.draggingItem.id;
          setLines(lines.map(line => {
            const waypointIndex = line.waypoints.findIndex(wp => wp.id === waypointId);
            if (waypointIndex === -1) return line;
            
            const newWaypoints = [...line.waypoints];
            const waypoint = newWaypoints[waypointIndex];
            
            // Apply constraints if any
            if (waypoint.constraints?.axis === 'x') {
              newWaypoints[waypointIndex] = {
                ...waypoint,
                x: waypoint.x + offset.x
              };
            } else if (waypoint.constraints?.axis === 'y') {
              newWaypoints[waypointIndex] = {
                ...waypoint,
                y: waypoint.y + offset.y
              };
            } else {
              newWaypoints[waypointIndex] = {
                ...waypoint,
                x: waypoint.x + offset.x,
                y: waypoint.y + offset.y
              };
            }
            
            return { ...line, waypoints: newWaypoints };
          }));
        }
        
        setInteractionState({
          ...interactionState,
          dragOffset: offset
        });
      }
    };
    
    const handleMouseUp = () => {
      setInteractionState({
        ...interactionState,
        draggingItem: null,
        dragStartPosition: null,
        dragOffset: { x: 0, y: 0 }
      });
    };
    
    if (interactionState.draggingItem) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [interactionState.draggingItem, interactionState.dragStartPosition]);

  // Handle ESC key to cancel line creation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && interactionState.isCreatingLine) {
        setInteractionState({
          ...interactionState,
          isCreatingLine: false,
          createStartPoint: null
        });
        setTempLine(null);
        setHoveredShapeId(null);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [interactionState.isCreatingLine]);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold mb-2">LucidChart-Style Line Editor</h1>
        <div className="flex items-center gap-6">
          {/* Line Type Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Line Type:</label>
            <select 
              value={lineType} 
              onChange={(e) => setLineType(e.target.value as LineType)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="straight">Straight</option>
              <option value="elbow">Elbow (90°)</option>
              <option value="curved">Curved</option>
            </select>
          </div>
          
          {/* Connection Mode */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Mode:</label>
            <select 
              value={connectionMode} 
              onChange={(e) => setConnectionMode(e.target.value as ConnectionMode)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="smart">Smart Routing</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          
          {/* Status */}
          <div className="text-sm text-gray-600">
            {interactionState.isCreatingLine ? 
              'Click on a connection point to complete the line (ESC to cancel)' : 
              'Click on a connection point to start drawing a line'
            }
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" stroke-width="0.5" opacity="0.3"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)" /%3E%3C/svg%3E")',
            cursor: interactionState.isCreatingLine ? 'crosshair' : 'default'
          }}
          onMouseMove={handleSVGMouseMove}
          onClick={handleSVGClick}
        >
          {/* Shapes */}
          <g>
            {shapes.map(shape => (
              <ShapeWithConnections
                key={shape.id}
                shape={shape}
                isHovered={hoveredShapeId === shape.id}
                showConnectionPoints={true}
                onConnectionPointClick={handleConnectionPointClick}
                highlightColor={hoveredShapeId === shape.id ? '#3b82f6' : undefined}
              />
            ))}
          </g>
          
          {/* Lines */}
          <g>
            {lines.map(line => (
              <LineRenderer
                key={line.id}
                path={line}
                onLineClick={handleLineClick}
                onWaypointMouseDown={handleWaypointMouseDown}
                showWaypoints={true}
              />
            ))}
          </g>
          
          {/* Temporary line during creation */}
          {tempLine && (
            <LineRenderer
              path={tempLine as LinePath}
              showWaypoints={false}
            />
          )}
        </svg>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click on any connection point (dots on shapes) to start drawing</li>
          <li>• Move to another connection point and click to complete</li>
          <li>• Hold near a shape for smart connection (blue highlight)</li>
          <li>• Select a line to see and drag waypoints</li>
          <li>• Press ESC to cancel line creation</li>
          <li>• Change line type and routing mode in the toolbar</li>
        </ul>
      </div>
    </div>
  );
}