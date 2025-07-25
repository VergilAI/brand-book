"use client";

import React, { useCallback, useRef, useEffect, useState } from "react";
import { useMapEditor } from "@/app/map-editor/hooks/useMapEditor";
import { usePointerPosition } from "@/app/map-editor/hooks/usePointerPosition";
import { useSnapping } from "@/app/map-editor/hooks/useSnapping";
import { useGestureDetection } from "@/app/map-editor/hooks/useGestureDetection";
import { useInertiaScroll } from "@/app/map-editor/hooks/useInertiaScroll";
import { useSmoothZoomController } from "@/app/map-editor/hooks/useSmoothZoomController";
import { HierarchicalGrid } from "./HierarchicalGrid";
import { SnapIndicators } from "./SnapIndicators";
import { BezierDrawTool } from "@/components/diagram-tool/drawing/BezierDrawTool";
import { TerritoryTablePanel } from "@/components/diagram-tool/panels/TerritoryTablePanel";
import { ZoomIndicator } from "@/components/diagram-tool/ui/ZoomIndicator";
import { GestureHint } from "@/components/diagram-tool/ui/GestureHint";
import { DebugPanel } from "@/components/diagram-tool/debug/DebugPanel";
import { cn } from "@/lib/utils";
import { Trash2, Crosshair } from "lucide-react";
import { useRelationships } from "@/app/map-editor/contexts/RelationshipContext";
import { TableMetadata, TableRow, TableRelationship } from "@/app/map-editor/types/database-types";
// Import from our local UI components
import { GridIcon, SnappingIcon } from "@/components/diagram-tool/ui/MapIcons";
// We'll use lucide-react icons for the others
import { Layers, Copy, Clipboard, Square } from "lucide-react";
import { TypeCombobox } from "@/components/diagram-tool/TypeCombobox";

// Data type color mapping
const dataTypeColors: Record<string, string> = {
  text: "#3B82F6", // Blue
  varchar: "#3B82F6", // Blue
  uuid: "#8B5CF6", // Purple
  integer: "#10B981", // Green
  bigint: "#10B981", // Green
  decimal: "#10B981", // Green
  boolean: "#F59E0B", // Amber
  date: "#EC4899", // Pink
  time: "#EC4899", // Pink
  timestamp: "#EC4899", // Pink
  json: "#6366F1", // Indigo
  jsonb: "#6366F1", // Indigo
  array: "#14B8A6", // Teal
  enum: "#F97316", // Orange
};

// Relationship type
interface TableRelationship {
  id: string;
  fromTable: string;
  fromRow: number;
  fromSide: 'left' | 'right';
  toTable: string;
  toRow: number;
  toSide: 'left' | 'right';
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

// Semantic bounding box for relationship markers
interface MarkerSemanticBox {
  lineSide: number;    // X-coordinate where marker attaches to line  
  tableSide: number;   // X-coordinate facing the table
  // The marker content is drawn FROM tableSide TO lineSide
  // This ensures crow's foot prongs point toward the table
}

// Helper function to calculate distance from point to line segment
function getDistanceToLine(point: Point, lineStart: Point, lineEnd: Point): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

// import styles from './MapCanvas.module.css' // Temporarily disabled due to build error
import type { Territory, Point } from "@/lib/lms/optimized-map-data";
import type { BezierPoint } from "@/app/map-editor/types/editor";
import type { SnapIndicator } from "@/app/map-editor/types/snapping";

// Create icon aliases for consistency
const BringToFrontIcon = Layers;
const BringForwardIcon = Layers;
const SendBackwardIcon = Layers;
const SendToBackIcon = Layers;
const CopyIcon = Copy;
const DuplicateIcon = Copy;
const PasteIcon = Clipboard;
const SelectAllIcon = Square;

// Helper function to move SVG path (needed for shape placement)
function moveSvgPath(path: string, deltaX: number, deltaY: number): string {
  // SVG path transformation - moves all coordinates by delta
  const result = path.replace(
    /([MLHVCSQTAZ])\s*((?:[-\d.]+\s*,?\s*)+)/gi,
    (match, command, params) => {
      const cmd = command.toUpperCase();

      if (cmd === "Z") return command;

      const numbers = params.match(/[-\d.]+/g) || [];
      const transformed: string[] = [];

      switch (cmd) {
        case "M":
        case "L":
          for (let i = 0; i < numbers.length; i += 2) {
            transformed.push((parseFloat(numbers[i]) + deltaX).toString());
            if (i + 1 < numbers.length) {
              transformed.push(
                (parseFloat(numbers[i + 1]) + deltaY).toString(),
              );
            }
          }
          break;
        case "C":
        case "Q":
        case "S":
        case "T":
          for (let i = 0; i < numbers.length; i += 2) {
            transformed.push((parseFloat(numbers[i]) + deltaX).toString());
            if (i + 1 < numbers.length) {
              transformed.push(
                (parseFloat(numbers[i + 1]) + deltaY).toString(),
              );
            }
          }
          break;
        case "H":
          for (const num of numbers) {
            transformed.push((parseFloat(num) + deltaX).toString());
          }
          break;
        case "V":
          for (const num of numbers) {
            transformed.push((parseFloat(num) + deltaY).toString());
          }
          break;
        case "A":
          for (let i = 0; i < numbers.length; i += 7) {
            transformed.push(numbers[i]); // rx
            transformed.push(numbers[i + 1]); // ry
            transformed.push(numbers[i + 2]); // rotation
            transformed.push(numbers[i + 3]); // large-arc
            transformed.push(numbers[i + 4]); // sweep
            transformed.push((parseFloat(numbers[i + 5]) + deltaX).toString()); // x
            transformed.push((parseFloat(numbers[i + 6]) + deltaY).toString()); // y
          }
          break;
      }

      return command + " " + transformed.join(" ");
    },
  );

  return result;
}

// Helper function to parse SVG path into polygon points
function parsePathToPoints(pathString: string): Point[] {
  const points: Point[] = [];
  let currentX = 0;
  let currentY = 0;


  // Match all path commands - updated regex to handle commas and decimals better
  const commandRegex = /([MLCQZ])\s*([^MLCQZ]*)/gi;
  let match;

  while ((match = commandRegex.exec(pathString)) !== null) {
    const command = match[1].toUpperCase();
    const coordsStr = match[2].trim();


    if (command === "Z") {
      continue; // Close path, no coordinates
    }

    // Split by whitespace or comma and parse numbers
    const coords = coordsStr
      .split(/[\s,]+/)
      .map(parseFloat)
      .filter((n) => !isNaN(n));

    switch (command) {
      case "M": // Move to
      case "L": // Line to
        if (coords.length >= 2) {
          currentX = coords[0];
          currentY = coords[1];
          points.push({ x: currentX, y: currentY });
        }
        break;

      case "C": // Cubic bezier
        if (coords.length >= 6) {
          // For hit detection, just use the end point
          // The curve interpolation was causing issues
          currentX = coords[4];
          currentY = coords[5];
          points.push({ x: currentX, y: currentY });
        }
        break;

      case "Q": // Quadratic bezier
        if (coords.length >= 4) {
          currentX = coords[2];
          currentY = coords[3];
          points.push({ x: currentX, y: currentY });
        }
        break;
    }
  }

  return points;
}

// Ray casting algorithm for point-in-polygon detection
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  if (polygon.length < 3) return false;

  let inside = false;
  const x = point.x;
  const y = point.y;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

// Helper function to check if point is inside territory using accurate polygon detection
function isPointInTerritory(point: Point, territory: Territory): boolean {
  // Special handling for database tables
  if (territory.metadata && 'tableName' in territory.metadata) {
    const { width, nameHeight, headerHeight, rowHeight, rows } = territory.metadata as TableMetadata;
    const totalHeight = nameHeight + headerHeight + rowHeight * rows.length;
    const x = territory.center.x - width / 2;
    const y = territory.center.y - totalHeight / 2;
    
    // Check if point is within table bounds
    return point.x >= x && point.x <= x + width && 
           point.y >= y && point.y <= y + totalHeight;
  }
  
  // Regular territory handling
  const polygonPoints = parsePathToPoints(territory.fillPath);
  if (polygonPoints.length < 3) {
    return false;
  }
  return isPointInPolygon(point, polygonPoints);
}

// Helper function to clamp selection coordinates within canvas bounds
function clampToCanvasBounds(
  point: Point,
  viewBox: { x: number; y: number; width: number; height: number },
): Point {
  return {
    x: Math.max(viewBox.x, Math.min(viewBox.x + viewBox.width, point.x)),
    y: Math.max(viewBox.y, Math.min(viewBox.y + viewBox.height, point.y)),
  };
}

interface MapCanvasProps {
  className?: string;
}

export function MapCanvas({ className }: MapCanvasProps) {
  const store = useMapEditor();
  const { position, updatePosition, svgRef } = usePointerPosition(
    store.view.gridSize,
    store.drawing.snapToGrid,
  );
  const { getSnappedPoint, getSnappedDrawingPoint, isSnappingEnabled } =
    useSnapping();

  const isDragging = useRef(false);
  const lastPan = useRef(store.view.pan);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const [zoomDisplayTimer, setZoomDisplayTimer] =
    useState<NodeJS.Timeout | null>(null);

  // Gesture state to prevent confusion between pan and zoom
  const lastGestureType = useRef<"pan" | "zoom" | null>(null);
  const gestureTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialGestureScale = useRef<number>(1);
  const initialZoom = useRef<number>(1);
  const [gestureHint, setGestureHint] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [gridType, setGridType] = useState<"lines" | "dots">("lines");

  // Territory table is managed by the store now
  
  // Inline editing state for database tables
  const [editingCell, setEditingCell] = useState<{
    territoryId: string;
    rowIndex: number;
    columnKey: string;
    value: string;
  } | null>(null);
  const [editingTableName, setEditingTableName] = useState<{
    territoryId: string;
    value: string;
  } | null>(null);
  
  // Track if combobox is open to prevent canvas scrolling
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  
  // Click tracking for double-click detection
  const lastCellClick = useRef<{
    territoryId: string;
    rowIndex: number;
    columnKey: string;
    time: number;
  } | null>(null);
  const lastNameClick = useRef<{
    territoryId: string;
    time: number;
  } | null>(null);

  // Relationship drawing state
  const [drawingRelationship, setDrawingRelationship] = useState<{
    fromTable: string;
    fromRow: number;
    fromSide: 'left' | 'right';
    fromPoint: Point;
    toPoint: Point;
    snapTarget?: { tableId: string; row: number; side: 'left' | 'right' } | null;
  } | null>(null);
  
  // Use relationship context
  const { relationships, setRelationships, selectedRelationshipId, setSelectedRelationshipId } = useRelationships();
  
  // Force update during dragging for smooth relationship lines
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  // Selection box state
  const isAreaSelecting = useRef(false);
  const areaSelectStart = useRef({ x: 0, y: 0 });
  const areaSelectEnd = useRef({ x: 0, y: 0 });
  const [showAreaSelect, setShowAreaSelect] = React.useState(false);

  // Territory moving state
  const isMovingTerritories = useRef(false);
  const hasMoved = useRef(false);
  const moveStartPos = useRef({ x: 0, y: 0 });
  const territoryMoveOffsets = useRef<Record<string, { x: number; y: number }>>(
    {},
  );

  // Snapping state
  const [snapIndicators, setSnapIndicators] = React.useState<SnapIndicator[]>(
    [],
  );

  // Duplicate preview state
  const [duplicatePreviewOffset, setDuplicatePreviewOffset] =
    React.useState<Point | null>(null);


  // Hover state for territories
  const [hoveredTerritoryId, setHoveredTerritoryId] = React.useState<
    string | null
  >(null);

  // Gesture handling
  const inertiaScroll = useInertiaScroll({
    friction: 0.92,
    minVelocity: 0.5,
    onUpdate: (deltaX, deltaY) => {
      store.setPan({
        x: store.view.pan.x - deltaX / store.view.zoom,
        y: store.view.pan.y - deltaY / store.view.zoom,
      });
    },
  });

  // Enhanced smooth zoom controller
  const {
    wheelZoom,
    pinchZoom,
    setZoomLevel,
    instantPan,
    addPanMomentum,
    endGesture,
    currentZoom,
    targetZoom,
  } = useSmoothZoomController({
    zoom: store.view.zoom,
    pan: store.view.pan,
    setZoom: store.setZoom,
    setPan: store.setPan,
  });

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const resizeObserver = new ResizeObserver(updateSize);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();
    };
  }, []);

  // Track if user has used gestures (for hints)
  const hasUsedGestures = useRef({
    spacePan: false,
    trackpadPan: false,
    pinchZoom: false,
  });

  const gesture = useGestureDetection({
    // Disabled - we handle wheel events directly in handleWheel
    onPan: () => {},
    onZoom: () => {},
    onGestureEnd: () => {},
    onSpacePanStart: () => {
      // Show hint for first-time space pan
      if (!hasUsedGestures.current.spacePan) {
        hasUsedGestures.current.spacePan = true;
        setGestureHint({ show: true, message: "Hold Space + drag to pan" });
      }
    },
  });

  // Shape placement preview
  const [shapePlacementPreview, setShapePlacementPreview] = React.useState<{
    path: string;
    position: Point;
  } | null>(null);

  // Handle pointer events based on current tool
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault(); // Prevent default behaviors like text selection
      updatePosition(e);

      
      // Close any active cell or table name editing when clicking away
      const target = e.target as HTMLElement;
      const isEditingElement = target.tagName === 'INPUT' || target.tagName === 'SELECT';
      if (!isEditingElement) {
        if (editingCell) {
          setEditingCell(null);
        }
        if (editingTableName) {
          setEditingTableName(null);
        }
      }
      
      // Clear relationship selection when clicking on empty space
      // But not when clicking on a relationship path
      const isRelationshipClick = target.tagName === 'path' && target.getAttribute('cursor') === 'pointer';
      if (!isRelationshipClick && (target.tagName === 'svg' || target.tagName === 'rect')) {
        setSelectedRelationshipId(null);
      }

      // Disable right-click context menu
      if (e.button === 2) {
        e.preventDefault();
        return;
      }

      // Block all editing interactions in view mode (except pan and context menu)
      if (store.editMode === "view" && e.button === 0) {
        // Only allow panning in view mode
        if (
          e.shiftKey ||
          store.tool === "move" ||
          gesture.gestureState.isSpacePanning
        ) {
          // Continue with pan handling below
        } else {
          return; // Block all other interactions
        }
      }

      // Handle shape placement mode
      if (store.templateLibrary.placementMode.active && e.button === 0) {
        const rawPoint = position.svg;
        const { point: snappedPoint } = getSnappedPoint(rawPoint);
        store.placeShape(snappedPoint);
        setShapePlacementPreview(null);
        setSnapIndicators([]);
        return;
      }

      if (
        e.button === 1 ||
        (e.button === 0 && e.shiftKey) ||
        (e.button === 0 && store.tool === "move") ||
        (e.button === 0 && gesture.gestureState.isSpacePanning)
      ) {
        // Middle mouse, Shift+left click, move tool, or Space+drag for pan
        isDragging.current = true;
        lastPan.current = store.view.pan;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);

        // Stop any ongoing inertia
        inertiaScroll.stopInertia();
        return;
      }

      // Handle vertex editing mode
      if (store.editing.isEditing && e.button === 0) {
        const point = position.svg;

        // Check if clicking on a vertex
        const vertexRadius = 8 / store.view.zoom; // Scale with zoom
        const handleRadius = 6 / store.view.zoom;

        // Check vertices
        for (let i = 0; i < store.editing.vertexPositions.length; i++) {
          const vertex = store.editing.vertexPositions[i];
          const distance = Math.sqrt(
            Math.pow(point.x - vertex.x, 2) + Math.pow(point.y - vertex.y, 2),
          );

          if (distance < vertexRadius) {
            store.selectVertex(i, e.ctrlKey || e.metaKey);
            store.startDraggingVertex(i);
            e.currentTarget.setPointerCapture(e.pointerId);
            return;
          }

          // Check control handles
          if (vertex.controlPoints?.in) {
            const inDistance = Math.sqrt(
              Math.pow(point.x - vertex.controlPoints.in.x, 2) +
                Math.pow(point.y - vertex.controlPoints.in.y, 2),
            );
            if (inDistance < handleRadius) {
              store.startDraggingControlHandle(i, "in");
              e.currentTarget.setPointerCapture(e.pointerId);
              return;
            }
          }

          if (vertex.controlPoints?.out) {
            const outDistance = Math.sqrt(
              Math.pow(point.x - vertex.controlPoints.out.x, 2) +
                Math.pow(point.y - vertex.controlPoints.out.y, 2),
            );
            if (outDistance < handleRadius) {
              store.startDraggingControlHandle(i, "out");
              e.currentTarget.setPointerCapture(e.pointerId);
              return;
            }
          }
        }

        // Check if clicking on an edge to add a vertex
        const edgeThreshold = 10 / store.view.zoom;
        let closestEdge = { index: -1, point: point, distance: Infinity };

        for (let i = 0; i < store.editing.vertexPositions.length; i++) {
          const start = store.editing.vertexPositions[i];
          const end =
            store.editing.vertexPositions[
              (i + 1) % store.editing.vertexPositions.length
            ];

          const { point: closestPoint, distance } = getClosestPointOnSegment(
            point,
            start,
            end,
          );

          if (distance < closestEdge.distance) {
            closestEdge = { index: i, point: closestPoint, distance };
          }
        }

        if (closestEdge.distance < edgeThreshold) {
          // Add vertex on edge - apply proper snapping
          const { point: snappedPoint } = getSnappedPoint(closestEdge.point);
          store.addVertexOnEdge(closestEdge.index, snappedPoint);
          return;
        }

        // If not clicking on any vertex/handle/edge, clear selection
        store.clearVertexSelection();
        return;
      }

      if (store.tool === "select" && e.button === 0) {
        const point = position.svg;
        
        // Check if clicking on an editable element (table cell or name)
        const target = e.target as SVGElement;
        const isEditableElement = target.getAttribute('cursor') === 'text' && store.editMode === 'edit';
        const isRelationshipClick = target.tagName === 'path' && target.getAttribute('cursor') === 'pointer';

        // Check if clicking on any territory (selected or not)
        // Sort by zIndex first, then reverse to check topmost (last rendered) territories first
        const clickedTerritory = Object.values(store.map.territories)
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .reverse()
          .find((territory) => {
            return isPointInTerritory(point, territory);
          });

        if (clickedTerritory && !isEditableElement) {
          // Handle selection logic carefully to preserve multi-selection during drag
          if (!store.selection.territories.has(clickedTerritory.id)) {
            // Territory is not selected, so select it
            store.selectTerritory(clickedTerritory.id, e.ctrlKey || e.metaKey);
          } else if (e.ctrlKey || e.metaKey) {
            // Territory is already selected and user is holding Ctrl/Cmd, so toggle it off
            store.selectTerritory(clickedTerritory.id, true);
            // Don't start dragging if we just deselected the territory
            return;
          }
          // If territory is already selected and no modifier key, DON'T call selectTerritory
          // This preserves the current multi-selection for dragging

          // Prepare for potential territory movement
          isMovingTerritories.current = true;
          hasMoved.current = false;
          moveStartPos.current = point;
          territoryMoveOffsets.current = {};

          // Calculate initial offsets for all currently selected territories
          store.selection.territories.forEach((id) => {
            const territory = store.map.territories[id];
            if (territory) {
              territoryMoveOffsets.current[id] = {
                x: territory.center.x - point.x,
                y: territory.center.y - point.y,
              };
            }
          });

          // Also include the clicked territory if it wasn't already selected
          if (!territoryMoveOffsets.current[clickedTerritory.id]) {
            territoryMoveOffsets.current[clickedTerritory.id] = {
              x: clickedTerritory.center.x - point.x,
              y: clickedTerritory.center.y - point.y,
            };
          }

          e.currentTarget.setPointerCapture(e.pointerId);
        } else if (!isEditableElement && !isRelationshipClick) {
          // Start area selection on empty space (clamp to canvas bounds)
          // But not if clicking on an editable element or relationship
          const svgAspectRatio = svgRef.current
            ? svgRef.current.getBoundingClientRect().width /
              svgRef.current.getBoundingClientRect().height
            : 16 / 9;
          const baseWidth = 1000;
          const baseHeight = baseWidth / svgAspectRatio;
          const viewBoxWidth = baseWidth / store.view.zoom;
          const viewBoxHeight = baseHeight / store.view.zoom;
          const viewBounds = {
            x: store.view.pan.x,
            y: store.view.pan.y,
            width: viewBoxWidth,
            height: viewBoxHeight,
          };

          const clampedPoint = clampToCanvasBounds(point, viewBounds);
          isAreaSelecting.current = true;
          areaSelectStart.current = clampedPoint;
          areaSelectEnd.current = clampedPoint;
          setShowAreaSelect(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }
        return;
      }

      if (store.tool === "pen" && e.button === 0) {
        const rawPoint = position.svg;
        const previousPoint =
          store.drawing.bezierPath.length > 0
            ? store.drawing.bezierPath[store.drawing.bezierPath.length - 1]
            : undefined;

        // Apply snapping
        const { point: snappedPoint, indicators } = getSnappedDrawingPoint(
          rawPoint,
          previousPoint,
        );
        setSnapIndicators(indicators);

        if (!store.drawing.isDrawing) {
          // Start drawing with first point
          store.startDrawing(snappedPoint);
        } else {
          // Check if clicking near start point to close path
          const firstPoint = store.drawing.bezierPath[0];
          const distance = Math.sqrt(
            Math.pow(snappedPoint.x - firstPoint.x, 2) +
              Math.pow(snappedPoint.y - firstPoint.y, 2),
          );

          if (distance < 10 && store.drawing.bezierPath.length > 2) {
            store.finishDrawing();
            setSnapIndicators([]);
          } else {
            // Add the new point first, then we can drag to create its handles
            store.addBezierPoint(snappedPoint);
            // Set up for potential drag to create handles for this new point
            store.startDraggingHandle(snappedPoint);
          }
        }
      }
    },
    [store, position, updatePosition, getSnappedPoint, gesture, inertiaScroll],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isAreaSelecting.current) {
        e.preventDefault(); // Prevent text selection during area select
      }
      updatePosition(e);

      if (drawingRelationship) {
        // Check for nearby table edges with gravity/snap
        const snapDistance = 30; // Gravity distance in pixels
        let snapPoint = position.svg;
        let snapTarget: { tableId: string; row: number; side: 'left' | 'right' } | null = null;
        
        // Check all database tables for proximity
        Object.values(store.map.territories).forEach(territory => {
          if (territory.metadata?.type === 'database-table') {
            const meta = territory.metadata as TableMetadata;
            const width = meta.width || 300;
            const height = meta.nameHeight + meta.headerHeight + meta.rowHeight * meta.rows.length;
            const x = territory.center.x - width / 2;
            const y = territory.center.y - height / 2;
            
            // Check each row's connection points
            meta.rows.forEach((row: any, rowIndex: number) => {
              const rowY = y + meta.nameHeight + meta.headerHeight + meta.rowHeight * rowIndex + meta.rowHeight / 2;
              
              // Check left side
              const leftDotX = x - 5;
              const leftDist = Math.sqrt(
                Math.pow(position.svg.x - leftDotX, 2) + 
                Math.pow(position.svg.y - rowY, 2)
              );
              
              if (leftDist < snapDistance) {
                snapPoint = { x: leftDotX, y: rowY };
                snapTarget = { tableId: territory.id, row: rowIndex, side: 'left' };
              }
              
              // Check right side
              const rightDotX = x + width + 5;
              const rightDist = Math.sqrt(
                Math.pow(position.svg.x - rightDotX, 2) + 
                Math.pow(position.svg.y - rowY, 2)
              );
              
              if (rightDist < snapDistance) {
                snapPoint = { x: rightDotX, y: rowY };
                snapTarget = { tableId: territory.id, row: rowIndex, side: 'right' };
              }
            });
          }
        });
        
        // Update the relationship line with snap point
        setDrawingRelationship(prev => prev ? {
          ...prev,
          toPoint: snapPoint,
          snapTarget: snapTarget
        } as any : null);
        return;
      }

      if (isDragging.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;

        instantPan({
          x: lastPan.current.x - dx / store.view.zoom,
          y: lastPan.current.y - dy / store.view.zoom,
        });

        // Track velocity for inertia
        gesture.handleMouseMove(e as unknown as MouseEvent);
      } else if (
        store.editing.isDraggingVertex &&
        store.editing.draggedVertex !== null
      ) {
        // Move vertex with snapping
        const rawPoint = position.svg;
        const { point: snappedPoint, indicators } = getSnappedPoint(rawPoint);
        setSnapIndicators(indicators);
        store.updateVertexPosition(store.editing.draggedVertex, snappedPoint);
      } else if (
        store.editing.isDraggingHandle &&
        store.editing.draggedHandle !== null
      ) {
        // Move control handle
        const point = position.svg; // Don't snap control handles to grid
        store.updateControlHandle(
          store.editing.draggedHandle.vertex,
          store.editing.draggedHandle.type,
          point,
        );
      } else if (isMovingTerritories.current) {
        // Move selected territories with snapping
        const rawPos = position.svg;

        // Force update for smooth relationship line tracking
        if (relationships.length > 0) {
          forceUpdate();
        }

        // Calculate the center of all selected territories for snapping
        const selectedTerritories = Array.from(store.selection.territories)
          .map((id) => store.map.territories[id])
          .filter(Boolean);

        if (selectedTerritories.length > 0) {
          // Calculate bounding box center of selection
          const bounds = {
            minX: Math.min(...selectedTerritories.map((t) => t.center.x)),
            maxX: Math.max(...selectedTerritories.map((t) => t.center.x)),
            minY: Math.min(...selectedTerritories.map((t) => t.center.y)),
            maxY: Math.max(...selectedTerritories.map((t) => t.center.y)),
          };
          const selectionCenter = {
            x: (bounds.minX + bounds.maxX) / 2,
            y: (bounds.minY + bounds.maxY) / 2,
          };

          // Calculate raw delta
          const rawDeltaX = rawPos.x - moveStartPos.current.x;
          const rawDeltaY = rawPos.y - moveStartPos.current.y;

          // Check if we've moved enough to start actual movement (3px threshold)
          const distance = Math.sqrt(
            rawDeltaX * rawDeltaX + rawDeltaY * rawDeltaY,
          );
          if (distance > 3) {
            hasMoved.current = true;
          }

          // Only apply movement if we've crossed the threshold
          if (hasMoved.current) {
            if (!e.altKey) {
              // Normal move - calculate new position and move territories
              const potentialCenter = {
                x: selectionCenter.x + rawDeltaX,
                y: selectionCenter.y + rawDeltaY,
              };

              // Apply snapping to the center, excluding selected territories
              const excludeIds = selectedTerritories.map((t) => t.id);
              const { point: snappedCenter, indicators } = getSnappedPoint(
                potentialCenter,
                excludeIds,
              );
              setSnapIndicators(indicators);

              // Calculate snapped deltas
              const snappedDeltaX = snappedCenter.x - selectionCenter.x;
              const snappedDeltaY = snappedCenter.y - selectionCenter.y;

              // Move territories
              if (selectedTerritories.length > 0) {
                store.moveTerritories(
                  selectedTerritories.map((t) => t.id),
                  snappedDeltaX,
                  snappedDeltaY,
                );
                // Update start position based on snapped movement (only for non-Alt moves)
                moveStartPos.current = {
                  x: moveStartPos.current.x + snappedDeltaX,
                  y: moveStartPos.current.y + snappedDeltaY,
                };
              }
              setDuplicatePreviewOffset(null);
            } else {
              // Alt is held - show duplicate preview WITHOUT moving original territories
              // Calculate where the center of selection would be if we moved it
              const potentialCenter = {
                x: selectionCenter.x + rawDeltaX,
                y: selectionCenter.y + rawDeltaY,
              };

              // Apply snapping to the potential center position
              const excludeIds = selectedTerritories.map((t) => t.id);
              const { point: snappedCenter, indicators } = getSnappedPoint(
                potentialCenter,
                excludeIds,
              );
              setSnapIndicators(indicators);

              // Calculate the preview offset - this is how much to translate each territory
              const previewOffset = {
                x: snappedCenter.x - selectionCenter.x,
                y: snappedCenter.y - selectionCenter.y,
              };

              // Only show duplicate preview in edit mode
              if (store.editMode === "edit") {
                setDuplicatePreviewOffset(previewOffset);
              }
            }
          }
        }
      } else if (store.drawing.isDraggingHandle && store.tool === "pen") {
        // Update bezier handle during drag only when using pen tool
        const rawPoint = position.svg;
        const previousPoint =
          store.drawing.bezierPath.length > 1
            ? store.drawing.bezierPath[store.drawing.bezierPath.length - 2]
            : undefined;

        // Apply snapping for handle drag
        const { point: snappedPoint, indicators } = getSnappedDrawingPoint(
          rawPoint,
          previousPoint,
        );
        setSnapIndicators(indicators);
        store.updateDragHandle(snappedPoint);
      } else if (isAreaSelecting.current) {
        // Update area selection rectangle (clamp to canvas bounds)
        const svgAspectRatio = svgRef.current
          ? svgRef.current.getBoundingClientRect().width /
            svgRef.current.getBoundingClientRect().height
          : 16 / 9;
        const baseWidth = 1000;
        const baseHeight = baseWidth / svgAspectRatio;
        const viewBoxWidth = baseWidth / store.view.zoom;
        const viewBoxHeight = baseHeight / store.view.zoom;
        const viewBounds = {
          x: store.view.pan.x,
          y: store.view.pan.y,
          width: viewBoxWidth,
          height: viewBoxHeight,
        };

        areaSelectEnd.current = clampToCanvasBounds(position.svg, viewBounds);
      } else if (
        store.tool === "pen" &&
        store.drawing.isDrawing &&
        !store.drawing.isDraggingHandle
      ) {
        // Update snap indicators during pen tool movement when drawing
        const rawPoint = position.svg;
        const previousPoint =
          store.drawing.bezierPath.length > 0
            ? store.drawing.bezierPath[store.drawing.bezierPath.length - 1]
            : undefined;

        const { indicators } = getSnappedDrawingPoint(rawPoint, previousPoint);
        setSnapIndicators(indicators);
      } else if (store.tool === "pen" && !store.drawing.isDrawing) {
        // Update snap indicators during pen tool movement when not drawing
        const rawPoint = position.svg;
        const { indicators } = getSnappedPoint(rawPoint);
        setSnapIndicators(indicators);
      } else if (
        store.templateLibrary.placementMode.active &&
        store.templateLibrary.placementMode.shapeId
      ) {
        // Update shape placement preview
        const rawPoint = position.svg;
        const { point: snappedPoint, indicators } = getSnappedPoint(rawPoint);
        setSnapIndicators(indicators);
        store.updateShapePreview(snappedPoint);

        // Generate preview path
        import("@/components/diagram-tool/shapes/ShapeLibrary").then(
          ({ shapeLibrary }) => {
            const shape = shapeLibrary.getShape(
              store.templateLibrary.placementMode.shapeId!,
            );
            if (shape) {
              const path = shapeLibrary.generateShapePath(shape);
              setShapePlacementPreview({
                path: moveSvgPath(
                  path,
                  snappedPoint.x - shape.defaultSize.width / 2,
                  snappedPoint.y - shape.defaultSize.height / 2,
                ),
                position: snappedPoint,
              });
            }
          },
        );
      } else {
        // Clear snap indicators when not in a snapping mode
        if (snapIndicators.length > 0) {
          setSnapIndicators([]);
        }
      }
    },
    [
      store,
      updatePosition,
      position,
      getSnappedPoint,
      getSnappedDrawingPoint,
      gesture,
      drawingRelationship,
    ],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (drawingRelationship) {
        // Use snap target if available, otherwise check if we're over a connection dot
        if (drawingRelationship.snapTarget) {
          const { tableId, row, side } = drawingRelationship.snapTarget;
          
          // Don't create a relationship to the exact same dot
          if (!(tableId === drawingRelationship.fromTable && 
                row === drawingRelationship.fromRow && 
                side === drawingRelationship.fromSide)) {
            
            // Create the relationship
            const newRelationship: TableRelationship = {
              id: `rel-${Date.now()}`,
              fromTable: drawingRelationship.fromTable,
              fromRow: drawingRelationship.fromRow,
              fromSide: drawingRelationship.fromSide,
              toTable: tableId,
              toRow: row,
              toSide: side,
              relationshipType: store.templateLibrary.connectionType
            };
            
            setRelationships(prev => [...prev, newRelationship]);
          }
        } else {
          // Fallback: check if we're directly over a connection dot
          const target = e.target as SVGElement;
          if (target.getAttribute('data-connection-dot') === 'true') {
            const toTableId = target.getAttribute('data-table-id');
            const toRowIndex = parseInt(target.getAttribute('data-row-index') || '0');
            const toSide = target.getAttribute('data-side') as 'left' | 'right';
            
            // Don't create a relationship to the exact same dot
            if (!(toTableId === drawingRelationship.fromTable && 
                  toRowIndex === drawingRelationship.fromRow && 
                  toSide === drawingRelationship.fromSide)) {
              
              // Create the relationship
              const newRelationship: TableRelationship = {
                id: `rel-${Date.now()}`,
                fromTable: drawingRelationship.fromTable,
                fromRow: drawingRelationship.fromRow,
                fromSide: drawingRelationship.fromSide,
                toTable: toTableId!,
                toRow: toRowIndex,
                toSide: toSide,
                relationshipType: store.templateLibrary.connectionType
              };
              
              setRelationships(prev => [...prev, newRelationship]);
              }
          }
        }
        setDrawingRelationship(null);
        e.currentTarget.releasePointerCapture(e.pointerId);
        return;
      }

      if (isDragging.current) {
        isDragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);

        // Inertia disabled to prevent bouncing
        // const velocity = gesture.getVelocity()
        // if (Math.abs(velocity.x) > 50 || Math.abs(velocity.y) > 50) {
        //   inertiaScroll.startInertia(velocity)
        // }
      } else if (
        store.editing.isDraggingVertex ||
        store.editing.isDraggingHandle
      ) {
        // End vertex or handle dragging
        store.endDragging();
        setSnapIndicators([]); // Clear snap indicators
        e.currentTarget.releasePointerCapture(e.pointerId);
      } else if (store.drawing.isDraggingHandle) {
        // End bezier handle dragging and add the point
        const rawPoint = position.svg;
        const previousPoint =
          store.drawing.bezierPath.length > 1
            ? store.drawing.bezierPath[store.drawing.bezierPath.length - 2]
            : undefined;
        const { point: snappedPoint } = getSnappedDrawingPoint(
          rawPoint,
          previousPoint,
        );
        store.endDraggingHandle(snappedPoint);
        setSnapIndicators([]); // Clear snap indicators
      } else if (isAreaSelecting.current) {
        // Complete area selection
        const start = areaSelectStart.current;
        const end = areaSelectEnd.current;

        store.selectTerritoriesInArea(
          start.x,
          start.y,
          end.x,
          end.y,
          e.ctrlKey || e.metaKey,
        );

        // Reset area selection
        isAreaSelecting.current = false;
        setShowAreaSelect(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
      } else if (isMovingTerritories.current) {
        // Check if Alt/Option key is held for duplicate
        if (e.altKey && hasMoved.current) {
          // Calculate final offset for duplicate
          const finalDeltaX = position.svg.x - moveStartPos.current.x;
          const finalDeltaY = position.svg.y - moveStartPos.current.y;

          // Duplicate selected territories at the new position (only in edit mode)
          if (store.editMode === "edit") {
            const selectedIds = Array.from(store.selection.territories);
            store.duplicateTerritories(selectedIds, {
              x: finalDeltaX,
              y: finalDeltaY,
            });
          }
        }

        // Complete territory movement
        isMovingTerritories.current = false;
        setSnapIndicators([]); // Clear snap indicators
        setDuplicatePreviewOffset(null); // Clear duplicate preview
        e.currentTarget.releasePointerCapture(e.pointerId);

        // Reset hasMoved after a small delay to prevent onClick from firing on drag end
        setTimeout(() => {
          hasMoved.current = false;
        }, 10);
      }
    },
    [store, position, gesture, inertiaScroll, drawingRelationship],
  );

  // Handle zoom with wheel
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!containerSize.width || !containerSize.height) return;

      // Don't handle wheel events if combobox is open
      if (isComboboxOpen) return;

      // Check if the wheel event is happening over a panel
      const target = e.target as HTMLElement;
      const isOverPanel =
        target.closest("[data-panel]") ||
        target.closest(".z-50") || // Debug panel has z-50
        target.closest(".z-40"); // Territory panel has z-40

      if (isOverPanel) {
        // Don't handle wheel events over panels
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Clear gesture timeout
      if (gestureTimeout.current) {
        clearTimeout(gestureTimeout.current);
      }

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const center = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Detect gesture type based on macOS trackpad behavior:
      // - Pinch zoom: ALWAYS has ctrlKey = true on macOS
      // - Two-finger scroll: No ctrlKey, ANY deltaX or deltaY
      // - Mouse wheel: Larger deltaY values (usually > 50), always integer, no deltaX

      const isPinchZoom = e.ctrlKey;
      const hasHorizontalMovement = Math.abs(e.deltaX) > 0;
      const hasFractionalDelta = e.deltaY % 1 !== 0 || e.deltaX % 1 !== 0;

      // Mouse wheels typically have larger delta values (> 50) and are always integers
      // Trackpad two-finger scrolls have smaller deltas and often (but not always) fractional
      const isLikelyMouseWheel =
        !isPinchZoom &&
        !hasHorizontalMovement &&
        !hasFractionalDelta &&
        Math.abs(e.deltaY) > 50;

      // IMPORTANT: If it's not a pinch zoom and not a mouse wheel, it's a two-finger pan
      const isTwoFingerPan = !isPinchZoom && !isLikelyMouseWheel;

      // Determine gesture type, considering previous gesture for consistency
      let currentGesture: "pan" | "zoom" = isTwoFingerPan ? "pan" : "zoom";

      // If we recently did a different gesture, wait a bit before switching
      if (
        lastGestureType.current &&
        lastGestureType.current !== currentGesture
      ) {
        // Use previous gesture type for consistency during rapid movements
        currentGesture = lastGestureType.current;
      }

      if (currentGesture === "pan") {
        // Two-finger pan on trackpad - direct update, no momentum
        const deltaX = -e.deltaX;
        const deltaY = -e.deltaY;

        instantPan({
          x: store.view.pan.x - deltaX / store.view.zoom,
          y: store.view.pan.y - deltaY / store.view.zoom,
        });
      } else {
        // Zoom (either pinch zoom or mouse wheel)
        const delta = -e.deltaY;
        wheelZoom(delta, center, containerSize);

        // Show zoom indicator
        setShowZoomIndicator(true);
        if (zoomDisplayTimer) {
          clearTimeout(zoomDisplayTimer);
        }
        const timer = setTimeout(() => {
          setShowZoomIndicator(false);
        }, 2000);
        setZoomDisplayTimer(timer);
      }

      // Update last gesture type
      lastGestureType.current = currentGesture;

      // Reset gesture type after a short delay
      gestureTimeout.current = setTimeout(() => {
        lastGestureType.current = null;
      }, 100); // 100ms delay to prevent rapid switching
    },
    [
      containerSize,
      wheelZoom,
      instantPan,
      store,
      store.view.zoom,
      store.view.pan,
      isComboboxOpen,
    ],
  );

  // Safari gesture events support (for better trackpad handling)
  const handleGestureStart = useCallback(
    (e: any) => {
      e.preventDefault();
      lastGestureType.current = "zoom";
      initialGestureScale.current = e.scale || 1;
      initialZoom.current = store.view.zoom;
    },
    [store.view.zoom],
  );

  const handleGestureChange = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!containerSize.width || !containerSize.height) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const center = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Calculate relative scale from the start of the gesture
      const relativeScale = e.scale / initialGestureScale.current;
      const targetZoom = initialZoom.current * relativeScale;

      // Set zoom directly to avoid cumulative multiplication
      setZoomLevel(targetZoom, center, containerSize);
    },
    [containerSize, setZoomLevel],
  );

  const handleGestureEnd = useCallback(
    (e: any) => {
      e.preventDefault();
      lastGestureType.current = null;
      // Trigger zoom momentum
      endGesture();
    },
    [endGesture],
  );

  // Prevent page scrolling when over canvas
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
      return false;
    };

    // Use passive: false to ensure preventDefault works
    canvasElement.addEventListener("wheel", preventScroll, { passive: false });

    // Add Safari gesture event listeners if available
    if ("GestureEvent" in window) {
      canvasElement.addEventListener("gesturestart", handleGestureStart as EventListener);
      canvasElement.addEventListener(
        "gesturechange",
        handleGestureChange as EventListener,
      );
      canvasElement.addEventListener("gestureend", handleGestureEnd as EventListener);
    }

    return () => {
      canvasElement.removeEventListener("wheel", preventScroll);
      if ("GestureEvent" in window) {
        canvasElement.removeEventListener(
          "gesturestart",
          handleGestureStart as EventListener,
        );
        canvasElement.removeEventListener(
          "gesturechange",
          handleGestureChange as EventListener,
        );
        canvasElement.removeEventListener(
          "gestureend",
          handleGestureEnd as EventListener,
        );
      }
    };
  }, [handleGestureStart, handleGestureChange, handleGestureEnd]);

  // Handle double-click for editing
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent, territoryId: string) => {
      e.stopPropagation();
      e.preventDefault();
      if (store.tool === "select" && store.editMode === "edit") {
        store.startEditingTerritory(territoryId);
      }
    },
    [store],
  );

  // Helper function to find closest point on line segment
  const getClosestPointOnSegment = (
    point: Point,
    start: Point,
    end: Point,
  ): { point: Point; distance: number } => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
      return {
        point: start,
        distance: Math.sqrt(
          Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2),
        ),
      };
    }

    let t =
      ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));

    const closestPoint = {
      x: start.x + t * dx,
      y: start.y + t * dy,
    };

    const distance = Math.sqrt(
      Math.pow(point.x - closestPoint.x, 2) +
        Math.pow(point.y - closestPoint.y, 2),
    );

    return { point: closestPoint, distance };
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Check for Ctrl/Cmd shortcuts first
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "a" || e.key === "A") {
          // Select all territories
          e.preventDefault();
          if (store.editMode === "edit") {
            store.selectAll();
          }
        } else if (e.key === "c" || e.key === "C") {
          // Copy selected territories
          e.preventDefault();
          if (
            store.editMode === "edit" &&
            store.selection.territories.size > 0
          ) {
            store.copyTerritories(Array.from(store.selection.territories));
          }
        } else if (e.key === "v" || e.key === "V") {
          // Paste territories at current cursor position
          e.preventDefault();
          if (store.editMode === "edit") {
            store.pasteTerritories(position.svg);
          }
        } else if (e.key === "d" || e.key === "D") {
          // Duplicate selected territories with small offset
          e.preventDefault();
          if (
            store.editMode === "edit" &&
            store.selection.territories.size > 0
          ) {
            store.duplicateTerritories(Array.from(store.selection.territories));
          }
        } else if (e.key === "s" || e.key === "S") {
          // Ctrl/Cmd+S - could be used for save in the future
          e.preventDefault();
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedRelationshipId && !editingCell && !editingTableName) {
          // Delete selected relationship
          setRelationships(prev => prev.filter(rel => rel.id !== selectedRelationshipId));
          setSelectedRelationshipId(null);
        }
      } else if (e.key === "Escape") {
        if (store.templateLibrary.placementMode.active) {
          store.cancelShapePlacement();
          setShapePlacementPreview(null);
          setSnapIndicators([]);
        } else if (store.editing.isEditing) {
          store.stopEditingTerritory();
        } else if (store.drawing.isDrawing) {
          store.cancelDrawing();
        } else if (selectedRelationshipId) {
          // Clear relationship selection
          setSelectedRelationshipId(null);
        } else {
          store.clearSelection();
        }
      } else if (e.key === "Enter") {
        if (store.editing.isEditing) {
          store.stopEditingTerritory();
        } else if (
          store.drawing.isDrawing &&
          store.drawing.bezierPath.length >= 3
        ) {
          store.finishDrawing();
        }
      } else if (e.key === " " && store.editing.isEditing) {
        // Space to toggle bezier on selected vertices
        e.preventDefault();
        store.editing.selectedVertices.forEach((idx) => {
          store.toggleVertexBezier(idx);
        });
      } else if (
        e.key.toLowerCase() === "v" &&
        !store.editing.isEditing &&
        store.editMode === "edit"
      ) {
        store.setTool("select");
      } else if (
        e.key.toLowerCase() === "d" &&
        !store.editing.isEditing &&
        store.editMode === "edit"
      ) {
        store.setTool("pen");
      } else if (e.key.toLowerCase() === "h" && !store.editing.isEditing) {
        store.setTool("move");
      } else if (e.key.toLowerCase() === "g") {
        if (e.shiftKey) {
          // Shift+G to toggle grid type
          setGridType((prev) => (prev === "lines" ? "dots" : "lines"));
        } else {
          // G to toggle grid visibility
          store.toggleGrid();
        }
      } else if (e.key.toLowerCase() === "s") {
        // Toggle snapping
        store.toggleSnapping();
      } else if (e.key.toLowerCase() === "k" && !store.editing.isEditing) {
        // Toggle template library
        store.toggleTemplateLibrary();
      } else if (e.key.toLowerCase() === "t" && !store.editing.isEditing) {
        // Toggle territory table panel
        store.toggleTerritoryTable();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (
          store.editing.isEditing &&
          store.editing.selectedVertices.size > 0
        ) {
          // Delete selected vertices in editing mode
          // Sort indices in descending order to delete from end to start
          const indices = Array.from(store.editing.selectedVertices).sort(
            (a, b) => b - a,
          );
          indices.forEach((idx) => store.deleteVertex(idx));
        } else if (!store.editing.isEditing) {
          // Delete selected territories
          store.selection.territories.forEach((id) =>
            store.deleteTerritory(id),
          );
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        // Re-enable snapping when Alt is released
        store.setTemporarySnapDisabled(false);
      }
    };

    const handleKeyDownForAlt = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        // Temporarily disable snapping while Alt is held
        store.setTemporarySnapDisabled(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyDownForAlt);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleKeyDownForAlt);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [store, position, setGridType]);

  // Handle gesture keyboard events
  useEffect(() => {
    const handleGestureKeyDown = (e: KeyboardEvent) => {
      gesture.handleKeyDown(e);
    };

    const handleGestureKeyUp = (e: KeyboardEvent) => {
      gesture.handleKeyUp(e);
    };

    window.addEventListener("keydown", handleGestureKeyDown);
    window.addEventListener("keyup", handleGestureKeyUp);

    return () => {
      window.removeEventListener("keydown", handleGestureKeyDown);
      window.removeEventListener("keyup", handleGestureKeyUp);
    };
  }, [gesture]);

  // Calculate viewBox with dynamic aspect ratio
  const svgAspectRatio = svgRef.current
    ? svgRef.current.getBoundingClientRect().width /
      svgRef.current.getBoundingClientRect().height
    : 16 / 9; // fallback aspect ratio
  const baseWidth = 1000;
  const baseHeight = baseWidth / svgAspectRatio;
  const viewBoxWidth = baseWidth / store.view.zoom;
  const viewBoxHeight = baseHeight / store.view.zoom;
  const viewBox = `${store.view.pan.x} ${store.view.pan.y} ${viewBoxWidth} ${viewBoxHeight}`;

  // Current viewBox bounds for clamping
  const currentViewBounds = {
    x: store.view.pan.x,
    y: store.view.pan.y,
    width: viewBoxWidth,
    height: viewBoxHeight,
  };

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-primary",
        gesture.isGesturing() && "cursor-grabbing",
        className,
      )}
      onWheel={handleWheel}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
      onMouseLeave={() => {
        // Cancel area selection if mouse leaves the canvas container
        if (isAreaSelecting.current) {
          isAreaSelecting.current = false;
          setShowAreaSelect(false);
        }
      }}
      onContextMenu={(e) => e.preventDefault()} // Prevent browser context menu
    >
      {/* Canvas grid layer - render as background below SVG */}
      {store.view.showGrid &&
        containerSize.width > 0 &&
        containerSize.height > 0 && (
          <HierarchicalGrid
            width={containerSize.width}
            height={containerSize.height}
            zoom={store.view.zoom}
            pan={store.view.pan}
            gridType={gridType}
          />
        )}

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        viewBox={viewBox}
        onPointerDown={(e) => {
          handlePointerDown(e);
          gesture.handleMouseDown(e.nativeEvent as MouseEvent);
        }}
        onPointerMove={(e) => {
          handlePointerMove(e);
          gesture.handleMouseMove(e.nativeEvent as MouseEvent);
        }}
        onPointerUp={(e) => {
          handlePointerUp(e);
          gesture.handleMouseUp();
        }}
        onPointerLeave={(e) => {
          // End any ongoing area selection when leaving the SVG
          if (isAreaSelecting.current) {
            isAreaSelecting.current = false;
            setShowAreaSelect(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
          handlePointerUp(e);
        }}
        style={{
          cursor:
            gesture.gestureState.isSpacePanning && !isDragging.current
              ? "grab"
              : isDragging.current
                ? "grabbing"
                : isMovingTerritories.current
                  ? "grabbing"
                  : isAreaSelecting.current
                    ? "crosshair"
                    : store.tool === "move"
                      ? "grab"
                      : store.tool === "pen"
                        ? "crosshair"
                        : store.tool === "select"
                          ? "default"
                          : "default",
        }}
      >
        {/* SVG Definitions */}
        <defs>
          {/* 
            Semantic Bounding Box for Crow's Foot Markers:
            - Line Side: The side attached to the relationship line (x=10 in our coordinate system)
            - Table Side: The side facing the table (x=0 in our coordinate system)
            - The crow's foot always points TOWARD the table it's connected to
            - We need separate markers for start and end due to SVG orientation
          */}
          
          {/* Crow's foot marker for END positions (points forward toward table) */}
          <marker
            id="crowsfoot-end"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            {/* Three lines diverging - crow's foot pointing toward table */}
            <path
              d="M10,0 L0,5 M10,5 L0,5 M10,10 L0,5"
              stroke="var(--color-purple-400)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </marker>
          
          {/* Crow's foot marker for START positions (points backward toward table) */}
          <marker
            id="crowsfoot-start"
            markerWidth="10"
            markerHeight="10"
            refX="0"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            {/* Three lines converging - crow's foot pointing toward table */}
            <path
              d="M0,0 L10,5 M0,5 L10,5 M0,10 L10,5"
              stroke="var(--color-purple-400)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </marker>
          {/* Crow's foot marker for selected END positions */}
          <marker
            id="crowsfoot-end-selected"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M10,0 L0,5 M10,5 L0,5 M10,10 L0,5"
              stroke="var(--color-purple-600)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </marker>
          
          {/* Crow's foot marker for selected START positions */}
          <marker
            id="crowsfoot-start-selected"
            markerWidth="10"
            markerHeight="10"
            refX="0"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M0,0 L10,5 M0,5 L10,5 M0,10 L10,5"
              stroke="var(--color-purple-600)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </marker>
          {/* One relationship marker (vertical line) */}
          <marker
            id="one"
            markerWidth="10"
            markerHeight="24"
            refX="0"
            refY="12"
            orient="auto"
            markerUnits="userSpaceOnUse"
            data-line-side="0"
            data-table-side="5"
          >
            <line
              x1="5"
              y1="0"
              x2="5"
              y2="24"
              stroke="var(--color-purple-400)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </marker>
          {/* One relationship marker for selected */}
          <marker
            id="one-selected"
            data-line-side="0"
            data-table-side="5"
            markerWidth="10"
            markerHeight="24"
            refX="0"
            refY="12"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <line
              x1="5"
              y1="0"
              x2="5"
              y2="24"
              stroke="var(--color-purple-600)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </marker>
        </defs>
        {/* SVG Grid removed - now using Canvas HierarchicalGrid */}

        {/* Relationships between tables */}
        <g className="relationships">
          {relationships.map((rel) => {
            // Find the tables
            const fromTable = store.map.territories[rel.fromTable];
            const toTable = store.map.territories[rel.toTable];
            
            if (!fromTable || !toTable || 
                fromTable.metadata?.type !== 'database-table' || 
                toTable.metadata?.type !== 'database-table') {
              return null;
            }
            
            const fromMeta = fromTable.metadata as TableMetadata;
            const toMeta = toTable.metadata as TableMetadata;
            
            // Calculate positions with movement offset if table is being moved
            let fromCenterX = fromTable.center.x;
            let fromCenterY = fromTable.center.y;
            let toCenterX = toTable.center.x;
            let toCenterY = toTable.center.y;
            
            // Apply movement offset if tables are being moved
            if (isMovingTerritories.current && store.selection.territories.has(rel.fromTable)) {
              const deltaX = position.svg.x - moveStartPos.current.x;
              const deltaY = position.svg.y - moveStartPos.current.y;
              fromCenterX += deltaX;
              fromCenterY += deltaY;
            }
            
            if (isMovingTerritories.current && store.selection.territories.has(rel.toTable)) {
              const deltaX = position.svg.x - moveStartPos.current.x;
              const deltaY = position.svg.y - moveStartPos.current.y;
              toCenterX += deltaX;
              toCenterY += deltaY;
            }
            
            // Calculate positions using potentially adjusted centers
            const fromWidth = fromMeta.width || 300;
            const fromHeight = fromMeta.nameHeight + fromMeta.headerHeight + fromMeta.rowHeight * fromMeta.rows.length;
            const fromX = fromCenterX - fromWidth / 2;
            const fromY = fromCenterY - fromHeight / 2;
            const fromRowY = fromY + fromMeta.nameHeight + fromMeta.headerHeight + fromMeta.rowHeight * rel.fromRow + fromMeta.rowHeight / 2;
            const fromDotX = rel.fromSide === 'left' ? fromX - 5 : fromX + fromWidth + 5;
            
            const toWidth = toMeta.width || 300;
            const toHeight = toMeta.nameHeight + toMeta.headerHeight + toMeta.rowHeight * toMeta.rows.length;
            const toX = toCenterX - toWidth / 2;
            const toY = toCenterY - toHeight / 2;
            const toRowY = toY + toMeta.nameHeight + toMeta.headerHeight + toMeta.rowHeight * rel.toRow + toMeta.rowHeight / 2;
            const toDotX = rel.toSide === 'left' ? toX - 5 : toX + toWidth + 5;
            
            // Helper function to create a bezier curved path
            const createBezierPath = (fromX: number, fromY: number, toX: number, toY: number) => {
              const dx = Math.abs(toX - fromX);
              const controlOffset = Math.min(dx * 0.5, 100); // Limit the curve offset
              return `M ${fromX} ${fromY} C ${fromX + controlOffset} ${fromY}, ${toX - controlOffset} ${toY}, ${toX} ${toY}`;
            };
            
            // Helper function to create a straight line path
            const createStraightPath = (fromX: number, fromY: number, toX: number, toY: number) => {
              return `M ${fromX} ${fromY} L ${toX} ${toY}`;
            };
            
            // Use straight line for database relationships
            const path = createStraightPath(fromDotX, fromRowY, toDotX, toRowY);
            
            const isSelected = selectedRelationshipId === rel.id;
            
            return (
              <g key={rel.id}>
                {/* Invisible wider path for easier clicking */}
                <path
                  d={path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="20"
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRelationshipId(rel.id);
                    // Clear territory selection when selecting a relationship
                    store.clearSelection();
                  }}
                />
                {/* Visible relationship line */}
                <path
                  d={path}
                  fill="none"
                  stroke={isSelected ? "var(--color-purple-600)" : "var(--color-purple-400)"}
                  strokeWidth={isSelected ? "3" : "2"}
                  opacity={isSelected ? "1" : "0.8"}
                  className="pointer-events-none"
                  style={{
                    transition: isMovingTerritories.current ? 'none' : 'all 200ms'
                  }}
                  markerStart={
                    rel.relationshipType === 'many-to-many' 
                      ? (isSelected ? "url(#crowsfoot-start-selected)" : "url(#crowsfoot-start)")
                      : (isSelected ? "url(#one-selected)" : "url(#one)")
                  }
                  markerEnd={
                    rel.relationshipType === 'one-to-many' || rel.relationshipType === 'many-to-many'
                      ? (isSelected ? "url(#crowsfoot-end-selected)" : "url(#crowsfoot-end)")
                      : (isSelected ? "url(#one-selected)" : "url(#one)")
                  }
                />
              </g>
            );
          })}
        </g>

        {/* Existing territories */}
        <g className="territories">
          {Object.values(store.map.territories)
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)) // Sort by zIndex
            .map((territory) => {
              const isSelected = store.selection.territories.has(territory.id);

              // Check if territory would be selected by current area selection
              let wouldBeSelected = false;
              if (isAreaSelecting.current && showAreaSelect) {
                const minX = Math.min(
                  areaSelectStart.current.x,
                  areaSelectEnd.current.x,
                );
                const maxX = Math.max(
                  areaSelectStart.current.x,
                  areaSelectEnd.current.x,
                );
                const minY = Math.min(
                  areaSelectStart.current.y,
                  areaSelectEnd.current.y,
                );
                const maxY = Math.max(
                  areaSelectStart.current.y,
                  areaSelectEnd.current.y,
                );

                const { x, y } = territory.center;
                wouldBeSelected =
                  x >= minX && x <= maxX && y >= minY && y <= maxY;
              }

              // Check if this is a database table
              if (territory.metadata && 'tableName' in territory.metadata) {
                const { width, nameHeight, headerHeight, rowHeight, columns, rows, tableName } = territory.metadata as TableMetadata;
                const totalHeight = nameHeight + headerHeight + rowHeight * rows.length;
                const x = territory.center.x - width / 2;
                const y = territory.center.y - totalHeight / 2;
                
                return (
                  <g key={territory.id}
                    data-table-element="true"
                    onMouseEnter={() => setHoveredTerritoryId(territory.id)}
                    onMouseLeave={() => setHoveredTerritoryId(null)}
                  >
                    {/* Table background with rounded corners - make it clickable for selection */}
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={totalHeight}
                      rx="8"
                      ry="8"
                      fill="white"
                      stroke={isSelected ? "var(--color-purple-600)" : "var(--color-gray-200)"}
                      strokeWidth={isSelected ? 2 : 1}
                      cursor="pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        store.selectTerritory(territory.id, e.ctrlKey || e.metaKey);
                      }}
                    />
                    
                    {/* Invisible click areas for better selection - header area */}
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={nameHeight + headerHeight}
                      fill="transparent"
                      cursor="pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        store.selectTerritory(territory.id, e.ctrlKey || e.metaKey);
                      }}
                    />
                    
                    {/* Table name area with rounded top */}
                    <path
                      d={`M ${x + 8} ${y} 
                          L ${x + width - 8} ${y} 
                          Q ${x + width} ${y} ${x + width} ${y + 8}
                          L ${x + width} ${y + nameHeight}
                          L ${x} ${y + nameHeight}
                          L ${x} ${y + 8}
                          Q ${x} ${y} ${x + 8} ${y} Z`}
                      fill="var(--color-gray-50)"
                      stroke="none"
                      pointerEvents="none"
                    />
                    {editingTableName?.territoryId === territory.id ? (
                      <foreignObject
                        x={x}
                        y={y}
                        width={width}
                        height={nameHeight}
                      >
                        <input
                          type="text"
                          value={editingTableName.value}
                          onChange={(e) => setEditingTableName({ ...editingTableName, value: e.target.value })}
                          onBlur={() => {
                            if (editingTableName) {
                              const metadata = territory.metadata as TableMetadata;
                              store.updateTerritory(territory.id, {
                                name: editingTableName.value,
                                metadata: { ...metadata, tableName: editingTableName.value }
                              });
                              setEditingTableName(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            } else if (e.key === 'Escape') {
                              setEditingTableName(null);
                            }
                          }}
                          className="w-full h-full px-2 text-center text-base font-bold bg-purple-50 border-0 outline-none focus:ring-2 focus:ring-purple-500"
                          autoFocus
                        />
                      </foreignObject>
                    ) : (
                      <g>
                        {/* Invisible clickable area for table name */}
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={nameHeight}
                          fill="transparent"
                          cursor={store.editMode === "edit" ? "text" : "default"}
                          onPointerDown={(e) => {
                            if (store.editMode === "edit") {
                              e.stopPropagation();
                              e.preventDefault();
                            }
                          }}
                          onClick={(e) => {
                            if (store.editMode === "edit") {
                              e.stopPropagation();
                              e.preventDefault();
                              const now = Date.now();
                              
                              // Check if this is a double-click (within 300ms of last click)
                              if (lastNameClick.current && 
                                  lastNameClick.current.territoryId === territory.id &&
                                  now - lastNameClick.current.time < 300) {
                                setEditingTableName({ territoryId: territory.id, value: tableName || 'Untitled Table' });
                                lastNameClick.current = null;
                              } else {
                                // Record this click and select the table
                                lastNameClick.current = { territoryId: territory.id, time: now };
                                // Select the table on single click
                                if (!store.selection.territories.has(territory.id)) {
                                  store.selectTerritory(territory.id, e.ctrlKey || e.metaKey);
                                }
                              }
                            } else {
                              // In view mode, select the table
                              e.stopPropagation();
                              store.selectTerritory(territory.id, e.ctrlKey || e.metaKey);
                            }
                          }}
                        />
                        <text
                          x={x + 16}
                          y={y + nameHeight / 2}
                          textAnchor="start"
                          dominantBaseline="middle"
                          fontSize="15"
                          fontWeight="600"
                          fill="var(--color-gray-900)"
                          pointerEvents="none"
                        >
                          {tableName || 'Untitled Table'}
                        </text>
                      </g>
                    )}
                    
                    {/* Header separator line */}
                    <line
                      x1={x}
                      y1={y + nameHeight}
                      x2={x + width}
                      y2={y + nameHeight}
                      stroke="var(--color-gray-200)"
                      strokeWidth="1"
                    />
                    {/* Header bottom separator */}
                    <line
                      x1={x}
                      y1={y + nameHeight + headerHeight}
                      x2={x + width}
                      y2={y + nameHeight + headerHeight}
                      stroke="var(--color-gray-200)"
                      strokeWidth="1"
                    />
                    
                    {/* Column lines and headers */}
                    {columns.map((col, i) => (
                      <g key={i}>
                        {i > 0 && (
                          <line
                            x1={x + (width / 3) * i}
                            y1={y + nameHeight}
                            x2={x + (width / 3) * i}
                            y2={y + nameHeight + headerHeight + rowHeight * rows.length}
                            stroke="var(--color-gray-200)"
                            strokeWidth="1"
                          />
                        )}
                        <text
                          x={x + (width / 3) * i + width / 6}
                          y={y + nameHeight + headerHeight / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="13"
                          fontWeight="500"
                          fill="var(--color-gray-600)"
                        >
                          {col}
                        </text>
                      </g>
                    ))}
                    
                    {/* Data rows */}
                    {rows.map((row, rowIndex) => {
                      const rowY = y + nameHeight + headerHeight + rowHeight * rowIndex + rowHeight / 2;
                      
                      return (
                        <g key={rowIndex}>
                          {/* Row separator */}
                          {rowIndex > 0 && (
                            <line
                              x1={x}
                              y1={y + nameHeight + headerHeight + rowHeight * rowIndex}
                              x2={x + width}
                              y2={y + nameHeight + headerHeight + rowHeight * rowIndex}
                              stroke="var(--color-gray-200)"
                              strokeWidth="1"
                            />
                          )}
                          
                          {/* Connection dots - only show when table is selected or during relationship drawing */}
                          {(isSelected || drawingRelationship) && (
                            <circle
                              cx={x - 5}
                              cy={rowY}
                            r={drawingRelationship?.snapTarget?.tableId === territory.id && 
                               drawingRelationship?.snapTarget?.row === rowIndex && 
                               drawingRelationship?.snapTarget?.side === 'left' 
                               ? "6" : "4"}
                            fill={drawingRelationship?.fromTable === territory.id && 
                                   drawingRelationship?.fromRow === rowIndex && 
                                   drawingRelationship?.fromSide === 'left' 
                                   ? "var(--color-purple-500)" 
                                   : drawingRelationship?.snapTarget?.tableId === territory.id && 
                                     drawingRelationship?.snapTarget?.row === rowIndex && 
                                     drawingRelationship?.snapTarget?.side === 'left'
                                   ? "var(--color-purple-400)"
                                   : "var(--color-gray-300)"}
                            stroke={drawingRelationship?.fromTable === territory.id && 
                                    drawingRelationship?.fromRow === rowIndex && 
                                    drawingRelationship?.fromSide === 'left' 
                                    ? "var(--color-purple-600)" 
                                    : drawingRelationship?.snapTarget?.tableId === territory.id && 
                                      drawingRelationship?.snapTarget?.row === rowIndex && 
                                      drawingRelationship?.snapTarget?.side === 'left'
                                    ? "var(--color-purple-500)"
                                    : "var(--color-gray-400)"}
                            strokeWidth={drawingRelationship?.snapTarget?.tableId === territory.id && 
                                        drawingRelationship?.snapTarget?.row === rowIndex && 
                                        drawingRelationship?.snapTarget?.side === 'left' 
                                        ? "2" : "1"}
                            cursor="crosshair"
                            data-connection-dot="true"
                            data-table-id={territory.id}
                            data-row-index={rowIndex}
                            data-side="left"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setDrawingRelationship({
                                fromTable: territory.id,
                                fromRow: rowIndex,
                                fromSide: 'left',
                                fromPoint: { x: x - 5, y: rowY },
                                toPoint: { x: x - 5, y: rowY }
                              });
                              e.currentTarget.setPointerCapture(e.pointerId);
                            }}
                          />
                          )}
                          {(isSelected || drawingRelationship) && (
                            <circle
                              cx={x + width + 5}
                              cy={rowY}
                            r={drawingRelationship?.snapTarget?.tableId === territory.id && 
                               drawingRelationship?.snapTarget?.row === rowIndex && 
                               drawingRelationship?.snapTarget?.side === 'right' 
                               ? "6" : "4"}
                            fill={drawingRelationship?.fromTable === territory.id && 
                                   drawingRelationship?.fromRow === rowIndex && 
                                   drawingRelationship?.fromSide === 'right' 
                                   ? "var(--color-purple-500)" 
                                   : drawingRelationship?.snapTarget?.tableId === territory.id && 
                                     drawingRelationship?.snapTarget?.row === rowIndex && 
                                     drawingRelationship?.snapTarget?.side === 'right'
                                   ? "var(--color-purple-400)"
                                   : "var(--color-gray-300)"}
                            stroke={drawingRelationship?.fromTable === territory.id && 
                                    drawingRelationship?.fromRow === rowIndex && 
                                    drawingRelationship?.fromSide === 'right' 
                                    ? "var(--color-purple-600)" 
                                    : drawingRelationship?.snapTarget?.tableId === territory.id && 
                                      drawingRelationship?.snapTarget?.row === rowIndex && 
                                      drawingRelationship?.snapTarget?.side === 'right'
                                    ? "var(--color-purple-500)"
                                    : "var(--color-gray-400)"}
                            strokeWidth={drawingRelationship?.snapTarget?.tableId === territory.id && 
                                        drawingRelationship?.snapTarget?.row === rowIndex && 
                                        drawingRelationship?.snapTarget?.side === 'right' 
                                        ? "2" : "1"}
                            cursor="crosshair"
                            data-connection-dot="true"
                            data-table-id={territory.id}
                            data-row-index={rowIndex}
                            data-side="right"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setDrawingRelationship({
                                fromTable: territory.id,
                                fromRow: rowIndex,
                                fromSide: 'right',
                                fromPoint: { x: x + width + 5, y: rowY },
                                toPoint: { x: x + width + 5, y: rowY }
                              });
                              e.currentTarget.setPointerCapture(e.pointerId);
                            }}
                          />
                          )}
                        
                        {/* Row data */}
                        {Object.entries(row).map(([key, value], colIndex) => {
                          const isEditingThisCell = editingCell?.territoryId === territory.id && 
                                                  editingCell?.rowIndex === rowIndex && 
                                                  editingCell?.columnKey === key;
                          
                          if (isEditingThisCell) {
                            // Special handling for Type column - use combobox
                            if (key === 'type') {
                              return (
                                <foreignObject
                                  key={`${rowIndex}-${colIndex}`}
                                  x={x + (width / 3) * colIndex}
                                  y={y + nameHeight + headerHeight + rowHeight * rowIndex}
                                  width={width / 3}
                                  height={rowHeight}
                                >
                                  <div className="w-full h-full flex items-center px-2">
                                    <TypeCombobox
                                      value={value || 'text'}
                                      onChange={(newValue) => {
                                        const metadata = territory.metadata as TableMetadata;
                                        const newRows = [...metadata.rows];
                                        newRows[rowIndex][key] = newValue;
                                        store.updateTerritory(territory.id, {
                                          metadata: { ...metadata, rows: newRows }
                                        });
                                        setEditingCell(null);
                                      }}
                                      onBlur={() => {
                                        setEditingCell(null);
                                        setIsComboboxOpen(false);
                                      }}
                                      onOpenChange={setIsComboboxOpen}
                                    />
                                  </div>
                                </foreignObject>
                              );
                            }
                            
                            // Regular text input for other columns
                            return (
                              <foreignObject
                                key={`${rowIndex}-${colIndex}`}
                                x={x + (width / 3) * colIndex}
                                y={y + nameHeight + headerHeight + rowHeight * rowIndex}
                                width={width / 3}
                                height={rowHeight}
                              >
                                <input
                                  type="text"
                                  value={editingCell.value}
                                  onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                                  onBlur={() => {
                                    if (editingCell) {
                                      const metadata = territory.metadata as TableMetadata;
                                      const newRows = [...metadata.rows];
                                      newRows[editingCell.rowIndex][editingCell.columnKey] = editingCell.value;
                                      store.updateTerritory(territory.id, {
                                        metadata: { ...metadata, rows: newRows }
                                      });
                                      setEditingCell(null);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.currentTarget.blur();
                                    } else if (e.key === 'Escape') {
                                      setEditingCell(null);
                                    }
                                  }}
                                  className="w-full h-full px-2 text-center text-sm bg-white border-0 outline-none focus:ring-2 focus:ring-purple-500"
                                  autoFocus
                                />
                              </foreignObject>
                            );
                          }
                          
                          return (
                            <g key={`${rowIndex}-${colIndex}`}>
                              {/* Invisible clickable area for the cell */}
                              <rect
                                x={x + (width / 3) * colIndex}
                                y={y + nameHeight + headerHeight + rowHeight * rowIndex}
                                width={width / 3}
                                height={rowHeight}
                                fill="transparent"
                                cursor={store.editMode === "edit" ? "text" : "default"}
                                onPointerDown={(e) => {
                                  if (store.editMode === "edit") {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }
                                }}
                                onClick={(e) => {
                                  if (store.editMode === "edit") {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    
                                    // Type column opens on single click
                                    if (key === 'type') {
                                      setEditingCell({
                                        territoryId: territory.id,
                                        rowIndex,
                                        columnKey: key,
                                        value: value || 'text'
                                      });
                                      return;
                                    }
                                    
                                    // Other columns need double click
                                    const now = Date.now();
                                    if (lastCellClick.current && 
                                        lastCellClick.current.territoryId === territory.id &&
                                        lastCellClick.current.rowIndex === rowIndex &&
                                        lastCellClick.current.columnKey === key &&
                                        now - lastCellClick.current.time < 300) {
                                      setEditingCell({
                                        territoryId: territory.id,
                                        rowIndex,
                                        columnKey: key,
                                        value: value || ''
                                      });
                                      lastCellClick.current = null;
                                    } else {
                                      // Record this click and also select the table
                                      lastCellClick.current = { 
                                        territoryId: territory.id, 
                                        rowIndex, 
                                        columnKey: key, 
                                        time: now 
                                      };
                                      // Select the table on single click
                                      if (!store.selection.territories.has(territory.id)) {
                                        store.selectTerritory(territory.id, e.ctrlKey || e.metaKey);
                                      }
                                    }
                                  } else {
                                    // In view mode, select the table
                                    e.stopPropagation();
                                    store.selectTerritory(territory.id, e.ctrlKey || e.metaKey);
                                  }
                                }}
                              />
                              {key === 'type' ? (
                                <g>
                                  {/* Background for dropdown appearance */}
                                  <rect
                                    x={x + (width / 3) * colIndex + 10}
                                    y={y + nameHeight + headerHeight + rowHeight * rowIndex + 5}
                                    width={width / 3 - 20}
                                    height={rowHeight - 10}
                                    rx="4"
                                    fill="var(--color-gray-50)"
                                    stroke="var(--color-gray-200)"
                                    strokeWidth="1"
                                    pointerEvents="none"
                                  />
                                  {/* Color dot */}
                                  <circle
                                    cx={x + (width / 3) * colIndex + 24}
                                    cy={y + nameHeight + headerHeight + rowHeight * rowIndex + rowHeight / 2}
                                    r="4"
                                    fill={dataTypeColors[value as string] || dataTypeColors.text}
                                    pointerEvents="none"
                                  />
                                  <text
                                    x={x + (width / 3) * colIndex + 34}
                                    y={y + nameHeight + headerHeight + rowHeight * rowIndex + rowHeight / 2}
                                    textAnchor="start"
                                    dominantBaseline="middle"
                                    fontSize="12"
                                    fill="var(--color-gray-700)"
                                    pointerEvents="none"
                                  >
                                    {value || 'text'}
                                  </text>
                                  {/* Dropdown arrow */}
                                  <path
                                    d="M 0 0 L 4 4 L 8 0"
                                    transform={`translate(${x + (width / 3) * (colIndex + 1) - 20}, ${y + nameHeight + headerHeight + rowHeight * rowIndex + rowHeight / 2 - 2})`}
                                    fill="none"
                                    stroke="var(--color-gray-500)"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    pointerEvents="none"
                                  />
                                </g>
                              ) : (
                                <text
                                  x={x + (width / 3) * colIndex + width / 6}
                                  y={y + nameHeight + headerHeight + rowHeight * rowIndex + rowHeight / 2}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fontSize="12"
                                  fill="var(--color-gray-700)"
                                  pointerEvents="none"
                                >
                                  {value || ''}
                                </text>
                              )}
                            </g>
                          );
                        })}
                        </g>
                      );
                    })}
                  </g>
                );
              }
              
              // Regular territory rendering
              return (
                <path
                  key={territory.id}
                  d={territory.fillPath}
                  fill={
                    wouldBeSelected
                      ? "var(--color-gray-50)" // Would-be-selected: Gray Scale 50
                      : hoveredTerritoryId === territory.id && isSelected
                        ? "var(--color-gray-100)" // Selected Hover: Gray Scale 100
                        : hoveredTerritoryId === territory.id
                          ? "var(--color-gray-50)" // Hover: Gray Scale 50
                          : "var(--color-gray-25)" // Default: Gray Scale 25
                  }
                  stroke={
                    isSelected
                      ? "var(--color-purple-300)" // Selected: purple 300
                      : "var(--color-gray-800)" // Default: Gray Scale 800
                  }
                  strokeWidth={isSelected ? 3 : 2}
                  strokeDasharray={
                    wouldBeSelected && !isSelected ? "3 3" : undefined
                  }
                  cursor="pointer"
                  opacity={
                    store.editing.isEditing &&
                    store.editing.editingTerritoryId !== territory.id
                      ? 0.3
                      : 1
                  }
                  onClick={(e) => {
                    if (
                      store.tool === "select" &&
                      !hasMoved.current &&
                      !store.editing.isEditing
                    ) {
                      // Only handle click if we haven't just finished dragging
                      e.stopPropagation();
                      store.selectTerritory(territory.id, e.shiftKey);
                    }
                  }}
                  onDoubleClick={(e) => handleDoubleClick(e, territory.id)}
                  onMouseEnter={() => setHoveredTerritoryId(territory.id)}
                  onMouseLeave={() => setHoveredTerritoryId(null)}
                  className="transition-all duration-200"
                />
              );
            })}
        </g>

        {/* Duplicate preview */}
        {duplicatePreviewOffset && store.selection.territories.size > 0 && (
          <g className="duplicate-preview">
            {Array.from(store.selection.territories).map((territoryId) => {
              const territory = store.map.territories[territoryId];
              if (!territory) return null;

              // Create a transformed path for the preview
              const transform = `translate(${duplicatePreviewOffset.x}, ${duplicatePreviewOffset.y})`;

              return (
                <g key={`preview-${territory.id}`} transform={transform}>
                  <path
                    d={territory.fillPath}
                    fill="var(--color-purple-300)" // purple 300
                    fillOpacity="0.4"
                    style={{ pointerEvents: "none" }}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Shape placement preview */}
        {shapePlacementPreview && (
          <g className="shape-placement-preview">
            <path
              d={shapePlacementPreview.path}
              fill="var(--color-purple-300)" // purple 300
              fillOpacity="0.2"
              stroke="var(--color-purple-300)" // purple 300
              strokeWidth="2"
              strokeDasharray="3 3"
              className="pointer-events-none stroke-dashed"
            />
            <circle
              cx={shapePlacementPreview.position.x}
              cy={shapePlacementPreview.position.y}
              r="4"
              fill="var(--color-purple-300)" // purple 300
              className="pointer-events-none"
            />
          </g>
        )}

        {/* Vertex editing visualization */}
        {store.editing.isEditing &&
          store.editing.vertexPositions.length > 0 && (
            <g className="vertex-editing">
              {/* Territory edges - for visual feedback when adding vertices */}
              {store.editing.vertexPositions.map((vertex, index) => {
                const nextVertex =
                  store.editing.vertexPositions[
                    (index + 1) % store.editing.vertexPositions.length
                  ];
                return (
                  <line
                    key={`edge-${index}`}
                    x1={vertex.x}
                    y1={vertex.y}
                    x2={nextVertex.x}
                    y2={nextVertex.y}
                    stroke="transparent"
                    strokeWidth="20"
                    className="cursor-crosshair"
                    style={{ pointerEvents: "stroke" }}
                  />
                );
              })}
              {/* Control handle lines */}
              {store.editing.vertexPositions.map((vertex, index) => (
                <g key={`vertex-handles-${index}`}>
                  {/* In control handle */}
                  {vertex.controlPoints?.in && (
                    <>
                      <line
                        x1={vertex.x}
                        y1={vertex.y}
                        x2={vertex.controlPoints.in.x}
                        y2={vertex.controlPoints.in.y}
                        stroke="var(--color-purple-300)" // purple 300
                        strokeWidth="2"
                        opacity="1"
                        className="pointer-events-none"
                      />
                      <circle
                        cx={vertex.controlPoints.in.x}
                        cy={vertex.controlPoints.in.y}
                        r="6"
                        fill="var(--color-purple-300)" // purple 300
                        stroke="var(--color-purple-300)" // purple 300
                        strokeWidth="2"
                        className="cursor-move"
                        style={{ cursor: "move" }}
                      />
                    </>
                  )}

                  {/* Out control handle */}
                  {vertex.controlPoints?.out && (
                    <>
                      <line
                        x1={vertex.x}
                        y1={vertex.y}
                        x2={vertex.controlPoints.out.x}
                        y2={vertex.controlPoints.out.y}
                        stroke="var(--color-purple-300)" // purple 300
                        strokeWidth="2"
                        opacity="1"
                        className="pointer-events-none"
                      />
                      <circle
                        cx={vertex.controlPoints.out.x}
                        cy={vertex.controlPoints.out.y}
                        r="6"
                        fill="var(--color-purple-300)" // purple 300
                        stroke="var(--color-purple-300)" // purple 300
                        strokeWidth="2"
                        className="cursor-move"
                        style={{ cursor: "move" }}
                      />
                    </>
                  )}
                </g>
              ))}

              {/* Vertex anchor points */}
              {store.editing.vertexPositions.map((vertex, index) => {
                const hasBezier =
                  vertex.controlPoints &&
                  (vertex.controlPoints.in || vertex.controlPoints.out);
                return (
                  <g key={`vertex-${index}`}>
                    <circle
                      cx={vertex.x}
                      cy={vertex.y}
                      r="8"
                      fill={
                        store.editing.selectedVertices.has(index)
                          ? "var(--color-blue-400)"
                          : "var(--white)"
                      } // blue 400 / full white
                      stroke={
                        store.editing.selectedVertices.has(index)
                          ? "var(--color-blue-700)"
                          : "var(--color-purple-300)"
                      } // blue 700 / purple 300
                      strokeWidth="3"
                      className="cursor-move"
                      style={{ cursor: "move" }}
                    />
                    {/* Inner dot to indicate bezier vertex */}
                    {hasBezier && (
                      <circle
                        cx={vertex.x}
                        cy={vertex.y}
                        r="3"
                        fill={
                          store.editing.selectedVertices.has(index)
                            ? "var(--color-blue-400)"
                            : "var(--color-purple-300)"
                        } // blue 400 / purple 300
                        className="pointer-events-none"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

        {/* Drawing preview */}
        {store.drawing.isDrawing && (
          <g className="drawing-preview">
            {/* Completed path segments */}
            <path
              d={store.drawing.previewPath}
              fill="none"
              stroke="var(--color-purple-300)" // purple 300
              strokeWidth="2"
              strokeDasharray="3 3"
              className="pointer-events-none stroke-dashed"
            />

            {/* Live preview line from last point to cursor */}
            {!store.drawing.isDraggingHandle &&
              store.drawing.bezierPath.length > 0 &&
              (() => {
                const lastPoint =
                  store.drawing.bezierPath[store.drawing.bezierPath.length - 1];
                const rawPoint = position.svg;

                // Apply snapping to preview line
                const { point: snappedPoint } = getSnappedDrawingPoint(
                  rawPoint,
                  lastPoint,
                );
                const currentPoint = snappedPoint;

                return (
                  <line
                    x1={lastPoint.x}
                    y1={lastPoint.y}
                    x2={currentPoint.x}
                    y2={currentPoint.y}
                    stroke="var(--color-purple-300)" // purple 300
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    opacity="1"
                    className="pointer-events-none stroke-dashed"
                  />
                );
              })()}

            {/* Show close indicator when near start */}
            {store.drawing.bezierPath.length > 2 &&
              (() => {
                const firstPoint = store.drawing.bezierPath[0];
                const rawPoint = position.svg;
                const lastPoint =
                  store.drawing.bezierPath[store.drawing.bezierPath.length - 1];

                // Apply snapping
                const { point: snappedPoint } = getSnappedDrawingPoint(
                  rawPoint,
                  lastPoint,
                );
                const distance = Math.sqrt(
                  Math.pow(snappedPoint.x - firstPoint.x, 2) +
                    Math.pow(snappedPoint.y - firstPoint.y, 2),
                );

                return distance < 10 ? (
                  <circle
                    cx={firstPoint.x}
                    cy={firstPoint.y}
                    r="8"
                    fill="none"
                    stroke="var(--color-purple-300)" // purple 300
                    strokeWidth="2"
                    className="pointer-events-none animate-pulse"
                  />
                ) : null;
              })()}

            {/* Show bezier anchor points */}
            {store.drawing.bezierPath.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="var(--color-purple-300)" // purple 300
                stroke="var(--color-purple-300)" // purple 300
                strokeWidth="2"
                className="pointer-events-none"
              />
            ))}

            {/* Show control handles when dragging */}
            {store.drawing.isDraggingHandle &&
              store.drawing.dragStartPoint &&
              (() => {
                const dragStart = store.drawing.dragStartPoint;
                const rawPoint = position.svg;
                const previousPoint =
                  store.drawing.bezierPath.length > 1
                    ? store.drawing.bezierPath[
                        store.drawing.bezierPath.length - 2
                      ]
                    : undefined;

                // Apply snapping to handle
                const { point: snappedPoint } = getSnappedDrawingPoint(
                  rawPoint,
                  previousPoint,
                );
                const currentPoint = snappedPoint;

                return (
                  <g>
                    {/* Handle line */}
                    <line
                      x1={dragStart.x}
                      y1={dragStart.y}
                      x2={currentPoint.x}
                      y2={currentPoint.y}
                      stroke="var(--color-purple-300)" // purple 300
                      strokeWidth="2"
                      className="pointer-events-none"
                    />
                    {/* Handle point */}
                    <circle
                      cx={currentPoint.x}
                      cy={currentPoint.y}
                      r="4"
                      fill="var(--color-purple-300)" // purple 300
                      stroke="var(--color-purple-300)" // purple 300
                      strokeWidth="2"
                      className="pointer-events-none"
                    />
                  </g>
                );
              })()}
          </g>
        )}

        {/* Relationship line while drawing */}
        {drawingRelationship && (
          <g className="pointer-events-none">
            <line
              x1={drawingRelationship.fromPoint.x}
              y1={drawingRelationship.fromPoint.y}
              x2={drawingRelationship.toPoint.x}
              y2={drawingRelationship.toPoint.y}
              stroke="var(--color-purple-500)"
              strokeWidth="2"
            />
            {/* Show snap indicator when snapping to a connection point */}
            {drawingRelationship.snapTarget ? (
              <circle
                cx={drawingRelationship.toPoint.x}
                cy={drawingRelationship.toPoint.y}
                r="8"
                fill="var(--color-purple-500)"
                stroke="white"
                strokeWidth="2"
                opacity="0.8"
              />
            ) : (
              <circle
                cx={drawingRelationship.toPoint.x}
                cy={drawingRelationship.toPoint.y}
                r="4"
                fill="var(--color-purple-500)"
                stroke="var(--color-purple-600)"
                strokeWidth="1"
              />
            )}
          </g>
        )}

        {/* Area selection rectangle */}
        {showAreaSelect && (
          <rect
            x={Math.min(areaSelectStart.current.x, areaSelectEnd.current.x)}
            y={Math.min(areaSelectStart.current.y, areaSelectEnd.current.y)}
            width={Math.abs(
              areaSelectEnd.current.x - areaSelectStart.current.x,
            )}
            height={Math.abs(
              areaSelectEnd.current.y - areaSelectStart.current.y,
            )}
            fill="var(--color-purple-600)" // purple 600
            fillOpacity="0.1" // 10% opacity
            stroke="var(--color-purple-300)" // purple 300
            strokeWidth="1"
            strokeDasharray="3 3"
            className="pointer-events-none stroke-dashed"
            style={{ pointerEvents: "none" }}
          />
        )}

        {/* Cursor position indicator */}
        {store.tool === "pen" &&
          (() => {
            const rawPoint = position.svg;
            const lastPoint =
              store.drawing.isDrawing && store.drawing.bezierPath.length > 0
                ? store.drawing.bezierPath[store.drawing.bezierPath.length - 1]
                : undefined;

            // Apply snapping to cursor
            const { point: snappedPoint } = lastPoint
              ? getSnappedDrawingPoint(rawPoint, lastPoint)
              : getSnappedPoint(rawPoint);

            return (
              <circle
                cx={snappedPoint.x}
                cy={snappedPoint.y}
                r="3"
                fill="var(--color-purple-300)" // purple 300
                className="pointer-events-none"
              />
            );
          })()}

        {/* Snap indicators */}
        <SnapIndicators indicators={snapIndicators} zoom={store.view.zoom} />
      </svg>

      {/* Position display */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono">
        {position.svg.x}, {position.svg.y}
      </div>

      {/* Editing mode indicator */}
      {store.editing.isEditing && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="text-sm font-medium mb-1">Editing Mode</div>
          <div className="text-xs opacity-90 space-y-1">
            <div>• Drag vertices to reshape • Click edge to add vertex</div>
            <div>
              • Select vertex + SPACE to toggle bezier • DELETE to remove
            </div>
            <div>• Press ESC to cancel or ENTER to finish</div>
          </div>
        </div>
      )}

      {/* Zoom display - hide when zoom indicator is showing */}
      {!showZoomIndicator && (
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
          {Math.round(currentZoom * 100)}%
        </div>
      )}

      {/* Zoom indicator */}
      {showZoomIndicator && <ZoomIndicator zoom={currentZoom} />}

      {/* Gesture hint */}
      <GestureHint show={gestureHint.show} message={gestureHint.message} />

      {/* Center button */}
      <button
        onClick={() => {
          // Calculate viewBox dimensions at zoom level 1
          const baseWidth = 1000;
          const baseHeight = baseWidth / svgAspectRatio;
          // To center origin (0,0), set pan to negative half of viewBox dimensions
          const centerX = -baseWidth / 2;
          const centerY = -baseHeight / 2;
          instantPan({ x: centerX, y: centerY });
          setZoomLevel(1);
        }}
        className="absolute bottom-2 right-20 inline-flex items-center justify-center h-8 w-8 rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
        title="Center map (reset view)"
      >
        <Crosshair size={16} />
      </button>

      {/* Snap indicator */}
      {isSnappingEnabled && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm text-white rounded px-2 py-1 text-xs flex items-center gap-1">
          <SnappingIcon size={12} className="text-white" enabled={true} />
          Snap ON (S)
        </div>
      )}

      {/* Grid type indicator */}
      {store.view.showGrid && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm text-white rounded px-2 py-1 text-xs flex items-center gap-1">
          {gridType === "lines" ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-white"
            >
              <line
                x1="0"
                y1="4"
                x2="12"
                y2="4"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="8"
                x2="12"
                y2="8"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="4"
                y1="0"
                x2="4"
                y2="12"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="8"
                y1="0"
                x2="8"
                y2="12"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-white"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" />
              <circle cx="6" cy="2" r="1" fill="currentColor" />
              <circle cx="10" cy="2" r="1" fill="currentColor" />
              <circle cx="2" cy="6" r="1" fill="currentColor" />
              <circle cx="6" cy="6" r="1" fill="currentColor" />
              <circle cx="10" cy="6" r="1" fill="currentColor" />
              <circle cx="2" cy="10" r="1" fill="currentColor" />
              <circle cx="6" cy="10" r="1" fill="currentColor" />
              <circle cx="10" cy="10" r="1" fill="currentColor" />
            </svg>
          )}
          Grid: {gridType === "lines" ? "Lines" : "Dots"} (Shift+G)
        </div>
      )}

      {/* Territory Table Panel */}
      <TerritoryTablePanel
        isOpen={store.territoryTable.isOpen}
        onClose={() => store.toggleTerritoryTable()}
      />

      {/* Debug Panel */}
      <DebugPanel />

      {/* Context Menu removed - using FloatingPropertiesPanel instead */}
    </div>
  );
}
