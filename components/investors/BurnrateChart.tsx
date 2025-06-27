"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, isTouchDevice, formatCompactNumber } from "@/lib/utils";

interface ChartDataPoint {
  date: Date;
  burnRate: number;
  revenue: number;
  balance: number;
  oneTimeRevenue?: number;
  oneTimeExpense?: number;
  oneTimeRevenueName?: string;
  oneTimeExpenseName?: string;
  actualRevenue: number;
  projectedRevenue: number;
}

export interface OneTimeEvent {
  date: string;
  amount: number;
  name: string;
  type: 'revenue' | 'expense';
}

export interface RecurringItem {
  name?: string;
  source?: string;
  amount: number;
  transaction_type: string;
  date_info: {
    start_date?: string;
    end_date?: string;
    frequency?: string;
  };
}

interface BurnRateChartProps {
  currentBalance: number;
  monthlyBurnRate: number;
  monthlyRevenue: number;
  oneTimeEvents?: OneTimeEvent[];
  recurringRevenues?: RecurringItem[];
  recurringExpenses?: RecurringItem[];
}

export function BurnRateChart({ 
  currentBalance, 
  monthlyBurnRate, 
  monthlyRevenue,
  oneTimeEvents = [],
  recurringRevenues = [],
  recurringExpenses = []
}: BurnRateChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number; distance?: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const createTooltip = (className: string, borderColor: string) => {
    // Only create tooltips for non-touch devices
    if (!isTouchDevice()) {
      return d3.select("body").append("div")
        .attr("class", className)
        .style("position", "absolute")
        .style("padding", "12px")
        .style("background", "rgba(15, 23, 42, 0.95)")
        .style("border", `1px solid ${borderColor}`)
        .style("border-radius", "8px")
        .style("color", "#FFFFFF")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("transition", "opacity 0.2s");
    }
    return null;
  };
  
  // Handle touch events for pinch-to-zoom and pan
  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      touchStartRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
      
      // Start long press timer
      longPressTimerRef.current = setTimeout(() => {
        // Trigger tooltip on long press
        if (svgRef.current && touchStartRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          const touch = event.touches[0];
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          
          // Simulate click event for tooltip
          const clickEvent = new MouseEvent('click', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true
          });
          
          const element = document.elementFromPoint(touch.clientX, touch.clientY);
          if (element) {
            element.dispatchEvent(clickEvent);
          }
        }
      }, 500); // 500ms for long press
    } else if (event.touches.length === 2) {
      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      
      // Calculate initial distance for pinch-to-zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      touchStartRef.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance
      };
    }
  };
  
  const handleTouchMove = (event: React.TouchEvent) => {
    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (!touchStartRef.current) return;
    
    if (event.touches.length === 1 && zoomLevel > 1) {
      // Pan when zoomed
      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      setPanX(prev => Math.max(-dimensions.width * (zoomLevel - 1), Math.min(0, prev + deltaX)));
      touchStartRef.current.x = touch.clientX;
    } else if (event.touches.length === 2) {
      // Pinch-to-zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (touchStartRef.current.distance) {
        const scale = distance / touchStartRef.current.distance;
        setZoomLevel(prev => Math.max(1, Math.min(3, prev * scale)));
        touchStartRef.current.distance = distance;
      }
    }
  };
  
  const handleTouchEnd = () => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    touchStartRef.current = null;
    
    // Reset zoom if close to 1
    if (Math.abs(zoomLevel - 1) < 0.1) {
      setZoomLevel(1);
      setPanX(0);
    }
  };

  // Helper function to check if a recurring item is active for a given date
  const isRecurringActive = (item: RecurringItem, date: Date): boolean => {
    if (!item.date_info.start_date) return false;
    
    const startDate = new Date(item.date_info.start_date);
    if (date < startDate) return false;
    
    if (item.date_info.end_date) {
      const endDate = new Date(item.date_info.end_date);
      if (date > endDate) return false;
    }
    
    return true;
  };

  // Calculate monthly amount for a recurring item
  const getMonthlyAmount = (item: RecurringItem): number => {
    const freq = item.date_info.frequency?.toLowerCase();
    const multiplier = freq === "yearly" ? 1/12 : 
                      freq === "quarterly" ? 1/3 : 1;
    return item.amount * multiplier;
  };

  // Generate projection data for next 24 months
  const generateProjectionData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const today = new Date();
    let balance = currentBalance;

    // Process one-time events into a map by month
    const eventsByMonth: { [key: string]: { revenue?: number; expense?: number; revenueName?: string; expenseName?: string } } = {};
    
    oneTimeEvents.forEach(event => {
      try {
        const eventDate = new Date(event.date);
        
        // Check if date is valid
        if (isNaN(eventDate.getTime())) {
          return;
        }
        
        const monthDiff = (eventDate.getFullYear() - today.getFullYear()) * 12 + 
                         (eventDate.getMonth() - today.getMonth());
        
        // Only include events within the next 24 months
        if (monthDiff >= 0 && monthDiff < 24) {
          if (!eventsByMonth[monthDiff]) {
            eventsByMonth[monthDiff] = {};
          }
          
          if (event.type === 'revenue') {
            eventsByMonth[monthDiff].revenue = (eventsByMonth[monthDiff].revenue || 0) + event.amount;
            // Combine names if multiple events
            if (eventsByMonth[monthDiff].revenueName) {
              eventsByMonth[monthDiff].revenueName += ` + ${event.name}`;
            } else {
              eventsByMonth[monthDiff].revenueName = event.name;
            }
          } else {
            eventsByMonth[monthDiff].expense = (eventsByMonth[monthDiff].expense || 0) + event.amount;
            // Combine names if multiple events
            if (eventsByMonth[monthDiff].expenseName) {
              eventsByMonth[monthDiff].expenseName += ` + ${event.name}`;
            } else {
              eventsByMonth[monthDiff].expenseName = event.name;
            }
          }
        }
      } catch (error) {
        // Skip invalid events
      }
    });

    for (let i = 0; i < 24; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() + i);
      
      // Calculate actual monthly revenue for this specific month
      let monthlyRevenueForDate = 0;
      recurringRevenues.forEach(item => {
        if (isRecurringActive(item, date)) {
          monthlyRevenueForDate += getMonthlyAmount(item);
        }
      });
      
      // Calculate actual monthly expenses for this specific month
      let monthlyExpensesForDate = 0;
      recurringExpenses.forEach(item => {
        if (isRecurringActive(item, date)) {
          monthlyExpensesForDate += getMonthlyAmount(item);
        }
      });
      
      // Use calculated values if we have recurring data, otherwise fall back to provided totals
      const currentRevenue = recurringRevenues.length > 0 ? monthlyRevenueForDate : monthlyRevenue;
      const currentExpenses = recurringExpenses.length > 0 ? monthlyExpensesForDate : monthlyBurnRate;
      
      // First 3 months are "actual" revenue, rest is projected
      const isActual = i < 3;
      
      // For projected data, no growth trend
      const projectedRevenue = 0;
      const actualRevenue = currentRevenue;
      
      // Get one-time events for this month
      const oneTime = eventsByMonth[i] || {};
      
      // Calculate running balance including one-time items
      balance = balance - currentExpenses + currentRevenue + (oneTime.revenue || 0) - (oneTime.expense || 0);
      
      data.push({
        date,
        burnRate: currentExpenses,
        revenue: currentRevenue,
        balance: Math.max(0, balance), // Don't go negative for display
        oneTimeRevenue: oneTime.revenue,
        oneTimeExpense: oneTime.expense,
        oneTimeRevenueName: oneTime.revenueName,
        oneTimeExpenseName: oneTime.expenseName,
        actualRevenue: isActual ? currentRevenue : actualRevenue,
        projectedRevenue: projectedRevenue
      });

      // Stop if we hit zero
      if (balance <= 0) break;
    }

    return data;
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const isMobileView = width < 640;
        setIsMobile(isMobileView);
        
        // Adjust dimensions for mobile
        const chartWidth = isMobileView ? Math.max(width, 600) : width;
        const chartHeight = isMobileView ? 300 : 400;
        
        setDimensions({ width: chartWidth, height: chartHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const data = generateProjectionData();
    const margin = isMobile 
      ? { top: 20, right: 20, bottom: 80, left: 60 }
      : { top: 20, right: 80, bottom: 60, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // Create a group for zooming/panning
    const zoomGroup = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
      
    const g = zoomGroup.append("g")
      .attr("transform", `translate(${panX},0) scale(${zoomLevel},1)`);

    // Set up scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const maxValue = Math.max(
      d3.max(data, d => d.burnRate) || 0,
      d3.max(data, d => d.revenue) || 0,
      d3.max(data, d => d.oneTimeRevenue || 0) || 0,
      currentBalance
    );

    const minValue = Math.min(
      0,
      -(d3.max(data, d => d.oneTimeExpense || 0) || 0)
    );

    const yScale = d3.scaleLinear()
      .domain([minValue * 1.1, maxValue * 1.1])
      .range([height, 0]);

    // No gridlines for cleaner look

    // Define line generators
    const burnRateLine = d3.line<ChartDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.burnRate))
      .curve(d3.curveMonotoneX);

    const revenueLine = d3.line<ChartDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.revenue))
      .curve(d3.curveMonotoneX);

    const balanceLine = d3.line<ChartDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.balance))
      .curve(d3.curveMonotoneX);


    // Calculate bar width based on number of data points
    const barWidth = width / data.length * 0.6;

    // Add one-time revenue bars (green)
    g.selectAll(".revenue-bar")
      .data(data.filter(d => d.oneTimeRevenue))
      .enter().append("rect")
      .attr("class", "revenue-bar")
      .attr("x", d => xScale(d.date) - barWidth / 2)
      .attr("y", d => yScale(d.oneTimeRevenue || 0))
      .attr("width", barWidth)
      .attr("height", d => yScale(0) - yScale(d.oneTimeRevenue || 0))
      .attr("fill", "#10B981")
      .attr("opacity", 0.8)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
      });

    // Add one-time expense bars (red, negative)
    g.selectAll(".expense-bar")
      .data(data.filter(d => d.oneTimeExpense))
      .enter().append("rect")
      .attr("class", "expense-bar")
      .attr("x", d => xScale(d.date) - barWidth / 2)
      .attr("y", yScale(0))
      .attr("width", barWidth)
      .attr("height", d => yScale(-(d.oneTimeExpense || 0)) - yScale(0))
      .attr("fill", "#DC2626")
      .attr("opacity", 0.7)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("opacity", 0.7);
      });

    // Add the lines
    // Revenue line (green)
    const revenuePath = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#10B981")
      .attr("stroke-width", 3)
      .attr("d", revenueLine)
      .attr("opacity", 1);

    // Balance line (purple - dotted)
    const balancePath = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6366F1")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "8,4")
      .attr("d", balanceLine)
      .attr("opacity", 0.9);
      
    // Create tooltips (only for non-touch devices)
    const tooltip = createTooltip("vergil-chart-tooltip", "#6366F1");
      
    // Add hover line
    const hoverLine = g.append("line")
      .attr("class", "hover-line")
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "#6366F1")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0);
      
    // Add circle for hover point
    const hoverCircle = g.append("circle")
      .attr("r", 5)
      .style("fill", "#6366F1")
      .style("stroke", "#FFFFFF")
      .style("stroke-width", 2)
      .style("opacity", 0);
      
    // Add mouse interaction
    const bisectDate = d3.bisector<ChartDataPoint, Date>(d => d.date).left;
    
    // Add invisible wider path for balance line hover detection
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "transparent")
      .attr("stroke-width", 20)
      .attr("d", balanceLine)
      .style("cursor", "pointer")
      .on("mousemove", function(event) {
        if (!isTouchDevice()) {
          const [mouseX] = d3.pointer(event);
          const x0 = xScale.invert(mouseX);
          const i = bisectDate(data, x0, 1);
          const d0 = data[i - 1];
          const d1 = data[i];
          
          if (!d0 || !d1) return;
          
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          
          // Calculate net burn rate for this period
          const netBurn = d.burnRate - d.revenue;
          
          // Update hover elements
          hoverLine
            .attr("x1", xScale(d.date))
            .attr("x2", xScale(d.date))
            .style("opacity", 0.5);
            
          hoverCircle
            .attr("cx", xScale(d.date))
            .attr("cy", yScale(d.balance))
            .style("opacity", 1);
            
          // Format tooltip content
          const tooltipHtml = `
            <div style="font-weight: 600; margin-bottom: 8px; color: #A78BFA;">
              ${d3.timeFormat("%B %Y")(d.date)}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #9CA3AF;">Balance:</span> 
              <span style="font-weight: 600;">${formatCurrency(d.balance)}</span>
            </div>
            <div>
              <span style="color: #9CA3AF;">Net Burn:</span> 
              <span style="font-weight: 600; color: ${netBurn > 0 ? '#F472B6' : '#10B981'}">
                ${formatCurrency(Math.abs(netBurn))}/mo
              </span>
            </div>
          `;
          
          if (tooltip) {
            tooltip
              .html(tooltipHtml)
              .style("left", (event.pageX + 15) + "px")
              .style("top", (event.pageY - 28) + "px")
              .style("opacity", 1);
          }
        }
      })
      .on("mouseout", function() {
        hoverLine.style("opacity", 0);
        hoverCircle.style("opacity", 0);
        if (tooltip) tooltip.style("opacity", 0);
      })
      .on("click", function(event) {
        if (isTouchDevice()) {
          const [mouseX] = d3.pointer(event);
          const adjustedX = (mouseX - panX) / zoomLevel; // Adjust for zoom and pan
          const x0 = xScale.invert(adjustedX);
          const i = bisectDate(data, x0, 1);
          const d0 = data[i - 1];
          const d1 = data[i];
          
          if (!d0 || !d1) return;
          
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          const netBurn = d.burnRate - d.revenue;
          
          // Update hover elements
          hoverLine
            .attr("x1", xScale(d.date))
            .attr("x2", xScale(d.date))
            .style("opacity", 0.5);
            
          hoverCircle
            .attr("cx", xScale(d.date))
            .attr("cy", yScale(d.balance))
            .style("opacity", 1);
          
          // Set active tooltip for mobile
          const tooltipContent = `
            <div class="font-bold mb-2 text-cosmic-purple">
              ${d3.timeFormat("%B %Y")(d.date)}
            </div>
            <div class="mb-1">
              <span class="text-gray-500">Balance:</span> 
              <span class="font-semibold">${formatCurrency(d.balance)}</span>
            </div>
            <div>
              <span class="text-gray-500">Net Burn:</span> 
              <span class="font-semibold ${netBurn > 0 ? 'text-neural-pink' : 'text-green-500'}">
                ${formatCurrency(Math.abs(netBurn))}/mo
              </span>
            </div>
          `;
          
          // Adjust tooltip position for zoom and pan
          const tooltipX = xScale(d.date) * zoomLevel + margin.left + panX;
          const tooltipY = yScale(d.balance) + margin.top;
          
          setActiveTooltip({
            x: tooltipX,
            y: tooltipY,
            content: tooltipContent
          });
          
          // Hide tooltip after 3 seconds
          setTimeout(() => {
            setActiveTooltip(null);
            hoverLine.style("opacity", 0);
            hoverCircle.style("opacity", 0);
          }, 3000);
        }
      });
      
    // Create tooltips for other elements
    const barTooltip = createTooltip("vergil-chart-tooltip-bar", "transparent");
    const revenueTooltip = createTooltip("vergil-chart-tooltip-revenue", "#10B981");
      
    // Add hover elements for revenue
    const revenueHoverLine = g.append("line")
      .attr("class", "revenue-hover-line")
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "#10B981")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0);
      
    const revenueHoverCircle = g.append("circle")
      .attr("r", 5)
      .style("fill", "#10B981")
      .style("stroke", "#FFFFFF")
      .style("stroke-width", 2)
      .style("opacity", 0);
      
    // Add invisible wider path for revenue line hover
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "transparent")
      .attr("stroke-width", 20)
      .attr("d", revenueLine)
      .style("cursor", "pointer")
      .on("mousemove", function(event) {
        if (!isTouchDevice()) {
          const [mouseX] = d3.pointer(event);
          const x0 = xScale.invert(mouseX);
          const i = bisectDate(data, x0, 1);
          const d0 = data[i - 1];
          const d1 = data[i];
          
          if (!d0 || !d1) return;
          
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          
          // Update hover elements
          revenueHoverLine
            .attr("x1", xScale(d.date))
            .attr("x2", xScale(d.date))
            .style("opacity", 0.5);
            
          revenueHoverCircle
            .attr("cx", xScale(d.date))
            .attr("cy", yScale(d.revenue))
            .style("opacity", 1);
            
          // Format tooltip content
          const isProjected = d.projectedRevenue > 0;
          const tooltipHtml = `
            <div style="font-weight: 600; margin-bottom: 8px; color: #10B981;">
              ${d3.timeFormat("%B %Y")(d.date)}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #9CA3AF;">Total Revenue:</span> 
              <span style="font-weight: 600;">${formatCurrency(d.revenue)}</span>
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #9CA3AF;">Actual:</span> 
              <span style="font-weight: 600; color: #10B981;">${formatCurrency(d.actualRevenue)}</span>
            </div>
            <div>
              <span style="color: #9CA3AF;">Projected Growth:</span> 
              <span style="font-weight: 600; color: #A78BFA;">
                ${isProjected ? formatCurrency(d.revenue - d.actualRevenue) : "$0"}
              </span>
            </div>
          `;
          
          if (revenueTooltip) {
            revenueTooltip
              .html(tooltipHtml)
              .style("left", (event.pageX + 15) + "px")
              .style("top", (event.pageY - 28) + "px")
              .style("opacity", 1);
          }
            
          // Hide other tooltips if visible
          if (tooltip) tooltip.style("opacity", 0);
          hoverLine.style("opacity", 0);
          hoverCircle.style("opacity", 0);
          if (barTooltip) barTooltip.style("opacity", 0);
        }
      })
      .on("mouseout", function() {
        revenueHoverLine.style("opacity", 0);
        revenueHoverCircle.style("opacity", 0);
        if (revenueTooltip) revenueTooltip.style("opacity", 0);
      })
      .on("click", function(event) {
        if (isTouchDevice()) {
          const [mouseX] = d3.pointer(event);
          const adjustedX = (mouseX - panX) / zoomLevel; // Adjust for zoom and pan
          const x0 = xScale.invert(adjustedX);
          const i = bisectDate(data, x0, 1);
          const d0 = data[i - 1];
          const d1 = data[i];
          
          if (!d0 || !d1) return;
          
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          
          // Update hover elements
          revenueHoverLine
            .attr("x1", xScale(d.date))
            .attr("x2", xScale(d.date))
            .style("opacity", 0.5);
            
          revenueHoverCircle
            .attr("cx", xScale(d.date))
            .attr("cy", yScale(d.revenue))
            .style("opacity", 1);
            
          // Format tooltip content for mobile
          const isProjected = d.projectedRevenue > 0;
          const tooltipContent = `
            <div class="font-bold mb-2 text-green-500">
              ${d3.timeFormat("%B %Y")(d.date)}
            </div>
            <div class="mb-1">
              <span class="text-gray-500">Total Revenue:</span> 
              <span class="font-semibold">${formatCurrency(d.revenue)}</span>
            </div>
            <div class="mb-1">
              <span class="text-gray-500">Actual:</span> 
              <span class="font-semibold text-green-500">${formatCurrency(d.actualRevenue)}</span>
            </div>
            <div>
              <span class="text-gray-500">Projected Growth:</span> 
              <span class="font-semibold text-cosmic-purple">
                ${isProjected ? formatCurrency(d.revenue - d.actualRevenue) : "$0"}
              </span>
            </div>
          `;
          
          // Adjust tooltip position for zoom and pan
          const tooltipX = xScale(d.date) * zoomLevel + margin.left + panX;
          const tooltipY = yScale(d.revenue) + margin.top;
          
          setActiveTooltip({
            x: tooltipX,
            y: tooltipY,
            content: tooltipContent
          });
          
          // Hide tooltip after 3 seconds
          setTimeout(() => {
            setActiveTooltip(null);
            revenueHoverLine.style("opacity", 0);
            revenueHoverCircle.style("opacity", 0);
          }, 3000);
        }
      });
      
    // Update revenue bar interactions
    g.selectAll(".revenue-bar")
      .on("mouseover", function(event, d) {
        if (!isTouchDevice()) {
          d3.select(this).attr("opacity", 1);
          
          const tooltipHtml = `
            <div style="font-weight: 600; margin-bottom: 4px; color: #10B981;">
              ${d.oneTimeRevenueName || "One-time Revenue"}
            </div>
            <div>
              <span style="color: #9CA3AF;">Amount:</span> 
              <span style="font-weight: 600;">+${formatCurrency(d.oneTimeRevenue || 0)}</span>
            </div>
          `;
          
          if (barTooltip) {
            barTooltip
              .html(tooltipHtml)
              .style("border", "1px solid #10B981")
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 10) + "px")
              .style("opacity", 1);
          }
            
          // Hide other tooltips
          if (tooltip) tooltip.style("opacity", 0);
          hoverLine.style("opacity", 0);
          hoverCircle.style("opacity", 0);
          if (revenueTooltip) revenueTooltip.style("opacity", 0);
          revenueHoverLine.style("opacity", 0);
          revenueHoverCircle.style("opacity", 0);
        }
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        if (barTooltip) barTooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        if (isTouchDevice()) {
          d3.select(this).attr("opacity", 1);
          
          const tooltipContent = `
            <div class="font-bold mb-1 text-green-500">
              ${d.oneTimeRevenueName || "One-time Revenue"}
            </div>
            <div>
              <span class="text-gray-500">Amount:</span> 
              <span class="font-semibold">+${formatCurrency(d.oneTimeRevenue || 0)}</span>
            </div>
          `;
          
          // Adjust tooltip position for zoom and pan
          const tooltipX = xScale(d.date) * zoomLevel + margin.left + panX;
          const tooltipY = yScale(d.oneTimeRevenue || 0) + margin.top - 10;
          
          setActiveTooltip({
            x: tooltipX,
            y: tooltipY,
            content: tooltipContent
          });
          
          // Reset opacity and hide tooltip after 2 seconds
          setTimeout(() => {
            d3.select(this).attr("opacity", 0.8);
            setActiveTooltip(null);
          }, 2000);
        }
      });
      
    // Update expense bar interactions
    g.selectAll(".expense-bar")
      .on("mouseover", function(event, d) {
        if (!isTouchDevice()) {
          d3.select(this).attr("opacity", 1);
          
          const tooltipHtml = `
            <div style="font-weight: 600; margin-bottom: 4px; color: #DC2626;">
              ${d.oneTimeExpenseName || "One-time Expense"}
            </div>
            <div>
              <span style="color: #9CA3AF;">Amount:</span> 
              <span style="font-weight: 600; color: #DC2626;">-${formatCurrency(d.oneTimeExpense || 0)}</span>
            </div>
          `;
          
          if (barTooltip) {
            barTooltip
              .html(tooltipHtml)
              .style("border", "1px solid #DC2626")
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 10) + "px")
              .style("opacity", 1);
          }
            
          // Hide other tooltips
          if (tooltip) tooltip.style("opacity", 0);
          hoverLine.style("opacity", 0);
          hoverCircle.style("opacity", 0);
          if (revenueTooltip) revenueTooltip.style("opacity", 0);
          revenueHoverLine.style("opacity", 0);
          revenueHoverCircle.style("opacity", 0);
        }
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("opacity", 0.7);
        if (barTooltip) barTooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        if (isTouchDevice()) {
          d3.select(this).attr("opacity", 1);
          
          const tooltipContent = `
            <div class="font-bold mb-1 text-red-600">
              ${d.oneTimeExpenseName || "One-time Expense"}
            </div>
            <div>
              <span class="text-gray-500">Amount:</span> 
              <span class="font-semibold text-red-600">-${formatCurrency(d.oneTimeExpense || 0)}</span>
            </div>
          `;
          
          // Adjust tooltip position for zoom and pan
          const tooltipX = xScale(d.date) * zoomLevel + margin.left + panX;
          const tooltipY = yScale(0) + margin.top + 10;
          
          setActiveTooltip({
            x: tooltipX,
            y: tooltipY,
            content: tooltipContent
          });
          
          // Reset opacity and hide tooltip after 2 seconds
          setTimeout(() => {
            d3.select(this).attr("opacity", 0.7);
            setActiveTooltip(null);
          }, 2000);
        }
      });

    // Add axes - X-axis at bottom of chart
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${height})`);
      
    if (isMobile) {
      // Mobile: Show fewer ticks and rotate more
      xAxis.call(d3.axisBottom(xScale)
        .ticks(6)
        .tickFormat(d => d3.timeFormat("%b")(d as Date)))
        .style("color", "#6B7280")
        .style("font-size", "10px")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-60)");
    } else {
      // Desktop: Normal display
      xAxis.call(d3.axisBottom(xScale)
        .tickFormat(d => d3.timeFormat("%b %Y")(d as Date)))
        .style("color", "#6B7280")
        .style("font-size", "12px")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    }
      
    // Add X-axis line at y=0
    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", "#9CA3AF")
      .attr("stroke-width", 1.5);

    g.append("g")
      .call(d3.axisLeft(yScale)
        .ticks(isMobile ? 5 : 8)
        .tickFormat(d => {
          const value = +d;
          if (value === 0) return "0";
          if (isMobile) {
            // Use compact format for mobile
            return formatCompactNumber(value);
          }
          const millions = value / 1000000;
          if (Math.abs(millions) >= 1) {
            return `${millions.toFixed(1)}M Ft`;
          }
          const thousands = value / 1000;
          return `${thousands.toFixed(0)}k Ft`;
        }))
      .style("color", "#6B7280")
      .style("font-size", isMobile ? "10px" : "12px");


    // Add zero line if balance goes negative
    const zeroDate = data.find(d => d.balance === 0)?.date;
    if (zeroDate) {
      g.append("line")
        .attr("x1", xScale(zeroDate))
        .attr("x2", xScale(zeroDate))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#DC2626")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", 0.7);

      g.append("text")
        .attr("x", xScale(zeroDate))
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("fill", "#DC2626")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Zero Date");
    }

  }, [dimensions, currentBalance, monthlyBurnRate, monthlyRevenue, oneTimeEvents, recurringRevenues, recurringExpenses, isMobile, zoomLevel, panX]);
  
  useEffect(() => {
    return () => {
      // Cleanup all tooltips on unmount
      d3.selectAll("[class^='vergil-chart-tooltip']").remove();
    };
  }, []);

  const netBurn = monthlyBurnRate - monthlyRevenue;
  const runwayMonths = netBurn > 0 ? Math.floor(currentBalance / netBurn) : null;

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
              <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
              Burn Rate & Runway Analysis
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Financial trajectory projection
            </p>
            {/* Legend - responsive grid on mobile */}
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 bg-green-500"></div>
                <span className="text-[10px] sm:text-xs text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 opacity-80 rounded-sm"></div>
                <span className="text-[10px] sm:text-xs text-gray-600">One-time Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 opacity-70 rounded-sm"></div>
                <span className="text-[10px] sm:text-xs text-gray-600">One-time Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 bg-cosmic-purple border-t-2 border-dashed border-cosmic-purple"></div>
                <span className="text-[10px] sm:text-xs text-gray-600">Balance</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-wider">Net Burn</p>
            <p className={`text-lg sm:text-2xl font-bold font-display ${netBurn > 0 ? 'text-neural-pink' : 'text-green-500'}`}>
              {formatCurrency(Math.abs(netBurn))}
              <span className="text-xs sm:text-sm font-normal text-gray-600 ml-1">/ mo</span>
            </p>
            {runwayMonths !== null && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Runway: <span className="font-semibold">{runwayMonths} months</span>
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 relative" ref={containerRef}>
        {/* Mobile scrollable container */}
        <div 
          className={isMobile ? "overflow-x-auto -mx-3" : ""}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={isMobile ? "min-w-[600px] px-3" : ""}>
            <svg ref={svgRef} className="w-full" />
            
            {/* Mobile tooltip overlay */}
            {activeTooltip && isMobile && (
              <div 
                className="absolute bg-dark-900/95 border border-cosmic-purple/50 rounded-lg p-3 text-sm z-10"
                style={{
                  left: `${Math.min(activeTooltip.x, dimensions.width - 200)}px`,
                  top: `${Math.max(activeTooltip.y - 80, 10)}px`,
                  minWidth: '160px'
                }}
                dangerouslySetInnerHTML={{ __html: activeTooltip.content }}
              />
            )}
          </div>
        </div>
        
        {/* Mobile hint */}
        {isMobile && (
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-500">
              Tap on the chart for details • {zoomLevel > 1 ? 'Drag to pan • Pinch to zoom' : 'Pinch to zoom • Scroll horizontally'}
            </p>
            {zoomLevel > 1 && (
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPanX(0);
                }}
                className="text-[10px] text-cosmic-purple underline mt-1"
              >
                Reset zoom
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}