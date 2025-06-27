"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, isTouchDevice } from "@/lib/utils";
import { 
  useChartDimensions, 
  useMobileTooltip, 
  MobileTooltip, 
  createD3Tooltip,
  formatAxisTick,
  useChartZoom,
  ZoomControls
} from "./BaseChart";
import { MobileChartWrapper } from "./MobileChartWrapper";

interface RevenueData {
  date: Date;
  revenue: number;
  type: string;
}

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    type: string;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, isMobile] = useChartDimensions(containerRef, {
    height: 400,
    mobileHeight: 300,
    margins: { top: 20, right: 80, bottom: 60, left: 80 },
    mobileMargins: { top: 20, right: 20, bottom: 80, left: 60 }
  });
  const { activeTooltip, showTooltip } = useMobileTooltip();
  const { zoomState, handleTouchStart, handleTouchMove, handleTouchEnd, resetZoom, getTransformString } = useChartZoom();

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    // Convert data
    const chartData: RevenueData[] = data.map(d => ({
      date: new Date(d.month),
      revenue: d.revenue,
      type: d.type
    }));

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // Create zoom container
    const zoomContainer = svg.append("g")
      .attr("transform", `translate(${dimensions.margins.left},${dimensions.margins.top})`);
      
    const g = zoomContainer.append("g")
      .attr("transform", getTransformString());

    // Set up scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(chartData, d => d.date) as [Date, Date])
      .range([0, dimensions.innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.revenue) || 0])
      .range([dimensions.innerHeight, 0]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(["recurring", "one-time"])
      .range(["#10B981", "#A78BFA"]);

    // Stack the data
    const stack = d3.stack<RevenueData>()
      .keys(["recurring", "one-time"])
      .value((d, key) => d.type === key ? d.revenue : 0);

    const series = stack(chartData);

    // Create area generator
    const area = d3.area<any>()
      .x(d => xScale(d.data.date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    // Add the areas
    g.selectAll(".revenue-area")
      .data(series)
      .enter().append("path")
      .attr("class", "revenue-area")
      .attr("fill", d => colorScale(d.key))
      .attr("opacity", 0.8)
      .attr("d", area);

    // Create tooltip
    const tooltip = createD3Tooltip("revenue-tooltip", "#10B981");

    // Add interactive overlay
    const bisectDate = d3.bisector<RevenueData, Date>(d => d.date).left;
    
    // Add hover line
    const hoverLine = g.append("line")
      .attr("class", "hover-line")
      .attr("y1", 0)
      .attr("y2", dimensions.innerHeight)
      .style("stroke", "#6366F1")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0);

    // Add overlay for mouse events
    svg.append("rect")
      .attr("transform", `translate(${dimensions.margins.left},${dimensions.margins.top})`)
      .attr("width", dimensions.innerWidth)
      .attr("height", dimensions.innerHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", function(event) {
        if (!isTouchDevice()) {
          const [mouseX] = d3.pointer(event);
          const x0 = xScale.invert(mouseX - dimensions.margins.left);
          const i = bisectDate(chartData, x0, 1);
          const d0 = chartData[i - 1];
          const d1 = chartData[i];
          
          if (!d0 || !d1) return;
          
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          
          hoverLine
            .attr("x1", xScale(d.date))
            .attr("x2", xScale(d.date))
            .style("opacity", 0.5);
          
          if (tooltip) {
            tooltip
              .html(`
                <div style="font-weight: 600; margin-bottom: 8px; color: #10B981;">
                  ${d3.timeFormat("%B %Y")(d.date)}
                </div>
                <div>
                  <span style="color: #9CA3AF;">Revenue:</span> 
                  <span style="font-weight: 600;">${formatCurrency(d.revenue)}</span>
                </div>
                <div>
                  <span style="color: #9CA3AF;">Type:</span> 
                  <span style="font-weight: 600;">${d.type}</span>
                </div>
              `)
              .style("left", (event.pageX + 15) + "px")
              .style("top", (event.pageY - 28) + "px")
              .style("opacity", 1);
          }
        }
      })
      .on("mouseout", function() {
        hoverLine.style("opacity", 0);
        if (tooltip) tooltip.style("opacity", 0);
      })
      .on("click", function(event) {
        if (isTouchDevice()) {
          const [mouseX] = d3.pointer(event);
          const adjustedX = (mouseX - dimensions.margins.left - zoomState.translateX) / zoomState.scale;
          const x0 = xScale.invert(adjustedX);
          const i = bisectDate(chartData, x0, 1);
          const d0 = chartData[i - 1];
          const d1 = chartData[i];
          
          if (!d0 || !d1) return;
          
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          
          hoverLine
            .attr("x1", xScale(d.date))
            .attr("x2", xScale(d.date))
            .style("opacity", 0.5);
          
          const tooltipX = xScale(d.date) * zoomState.scale + dimensions.margins.left + zoomState.translateX;
          const tooltipY = yScale(d.revenue) + dimensions.margins.top;
          
          showTooltip({
            x: tooltipX,
            y: tooltipY,
            content: `
              <div class="font-bold mb-2 text-green-500">
                ${d3.timeFormat("%B %Y")(d.date)}
              </div>
              <div class="mb-1">
                <span class="text-gray-500">Revenue:</span> 
                <span class="font-semibold">${formatCurrency(d.revenue)}</span>
              </div>
              <div>
                <span class="text-gray-500">Type:</span> 
                <span class="font-semibold">${d.type}</span>
              </div>
            `
          });
          
          setTimeout(() => hoverLine.style("opacity", 0), 3000);
        }
      });

    // Add axes
    // X-axis
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${dimensions.innerHeight})`);
      
    if (isMobile) {
      xAxis.call(d3.axisBottom(xScale)
        .ticks(6)
        .tickFormat(d => d3.timeFormat("%b")(d as Date)))
        .style("font-size", "10px")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-60)");
    } else {
      xAxis.call(d3.axisBottom(xScale)
        .tickFormat(d => d3.timeFormat("%b %Y")(d as Date)))
        .style("font-size", "12px")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    }
    
    xAxis.select(".domain").style("color", "#6B7280");
    xAxis.selectAll(".tick line").style("color", "#6B7280");
    xAxis.selectAll(".tick text").style("color", "#6B7280");

    // Y-axis
    const yAxis = g.append("g")
      .call(d3.axisLeft(yScale)
        .ticks(isMobile ? 5 : 8)
        .tickFormat(d => formatAxisTick(+d, isMobile) + " Ft"))
      .style("font-size", isMobile ? "10px" : "12px");
      
    yAxis.select(".domain").style("color", "#6B7280");
    yAxis.selectAll(".tick line").style("color", "#6B7280");
    yAxis.selectAll(".tick text").style("color", "#6B7280");

    // Cleanup
    return () => {
      d3.selectAll(".revenue-tooltip").remove();
    };
  }, [dimensions, data, isMobile, showTooltip, zoomState, getTransformString]);

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
              <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
              Revenue Breakdown
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Monthly revenue by type
            </p>
            {/* Legend */}
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span className="text-[10px] sm:text-xs text-gray-600">Recurring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cosmic-purple rounded-sm"></div>
                <span className="text-[10px] sm:text-xs text-gray-600">One-time</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6" ref={containerRef}>
        <div
          onTouchStart={(e) => handleTouchStart(e, (x, y) => {
            // Trigger click event on long press
            const element = document.elementFromPoint(x, y);
            if (element) {
              element.dispatchEvent(new MouseEvent('click', { clientX: x, clientY: y, bubbles: true }));
            }
          })}
          onTouchMove={(e) => handleTouchMove(e, dimensions.width)}
          onTouchEnd={handleTouchEnd}
        >
          <MobileChartWrapper minWidth={600} showHint={isMobile} hintText={zoomState.scale > 1 ? 'Drag to pan • Pinch to zoom' : undefined}>
            <svg ref={svgRef} className="w-full" />
            <MobileTooltip tooltip={activeTooltip} containerWidth={dimensions.width} />
          </MobileChartWrapper>
        </div>
        <ZoomControls zoomLevel={zoomState.scale} onReset={resetZoom} />
      </CardContent>
    </Card>
  );
}