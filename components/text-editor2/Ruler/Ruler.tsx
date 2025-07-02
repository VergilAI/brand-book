"use client";

import { useState, useRef, useEffect } from "react";

export function Ruler() {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [leftMargin, setLeftMargin] = useState(1); // in inches
  const [rightMargin, setRightMargin] = useState(1); // in inches
  const [firstLineIndent, setFirstLineIndent] = useState(0); // in inches
  const rulerRef = useRef<HTMLDivElement>(null);

  const pageWidthInches = 8.5; // Letter size
  const pixelsPerInch = 96; // Standard screen DPI

  const handleMarkerDrag = (type: "left" | "right" | "indent", e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const rulerRect = rulerRef.current?.getBoundingClientRect();
    if (!rulerRect) return;

    const startValue = type === "left" ? leftMargin : type === "right" ? rightMargin : firstLineIndent;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaInches = deltaX / pixelsPerInch;
      const newValue = startValue + deltaInches;

      if (type === "left") {
        setLeftMargin(Math.max(0, Math.min(newValue, pageWidthInches - rightMargin - 1)));
      } else if (type === "right") {
        setRightMargin(Math.max(0, Math.min(newValue, pageWidthInches - leftMargin - 1)));
      } else {
        setFirstLineIndent(Math.max(-leftMargin, Math.min(newValue, 2)));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const renderRulerMarks = () => {
    const marks = [];
    const totalMarks = unit === "in" ? pageWidthInches * 8 : pageWidthInches * 2.54 * 4; // 8 subdivisions per inch, 4 per cm
    
    for (let i = 0; i <= totalMarks; i++) {
      const position = (i / totalMarks) * 100;
      const isMajor = unit === "in" ? i % 8 === 0 : i % 4 === 0;
      const isHalf = unit === "in" ? i % 4 === 0 : i % 2 === 0;
      
      marks.push(
        <div
          key={i}
          className={`absolute top-0 bg-gray-400 dark:bg-gray-600 ${
            isMajor ? "h-3 w-px" : isHalf ? "h-2 w-px" : "h-1 w-px"
          }`}
          style={{ left: `${position}%` }}
        />
      );
      
      if (isMajor) {
        const label = unit === "in" ? i / 8 : Math.floor(i / 4);
        marks.push(
          <div
            key={`label-${i}`}
            className="absolute top-3 text-xs text-gray-600 dark:text-gray-400"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          >
            {label}
          </div>
        );
      }
    }
    
    return marks;
  };

  return (
    <div className="relative h-10 bg-gray-100 dark:bg-gray-800 border-b">
      <div ref={rulerRef} className="relative h-full mx-8">
        {renderRulerMarks()}
        
        {/* Left margin marker */}
        <div
          className="absolute top-0 h-full w-4 cursor-ew-resize group"
          style={{ left: `${(leftMargin / pageWidthInches) * 100}%` }}
          onMouseDown={(e) => handleMarkerDrag("left", e)}
        >
          <div className="absolute top-5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-cosmic-purple group-hover:border-t-electric-violet transform -translate-x-1/2" />
        </div>
        
        {/* Right margin marker */}
        <div
          className="absolute top-0 h-full w-4 cursor-ew-resize group"
          style={{ right: `${(rightMargin / pageWidthInches) * 100}%` }}
          onMouseDown={(e) => handleMarkerDrag("right", e)}
        >
          <div className="absolute top-5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-cosmic-purple group-hover:border-t-electric-violet transform translate-x-1/2" />
        </div>
        
        {/* First line indent marker */}
        <div
          className="absolute top-0 h-full w-4 cursor-ew-resize group"
          style={{ left: `${((leftMargin + firstLineIndent) / pageWidthInches) * 100}%` }}
          onMouseDown={(e) => handleMarkerDrag("indent", e)}
        >
          <div className="absolute top-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-cosmic-purple group-hover:border-b-electric-violet transform -translate-x-1/2" />
        </div>
        
        {/* Tab stops would be added here */}
      </div>
      
      {/* Unit toggle */}
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 dark:text-gray-400 hover:text-cosmic-purple"
        onClick={() => setUnit(unit === "in" ? "cm" : "in")}
      >
        {unit}
      </button>
    </div>
  );
}