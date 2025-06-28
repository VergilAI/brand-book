"use client";

import { useEffect, useRef, useState } from "react";
import { select, selectAll } from 'd3-selection';
import { scaleTime, scaleLinear } from 'd3-scale';
import { extent, max, min, bisector } from 'd3-array';
import { line, curveMonotoneX } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import { pointer } from 'd3-selection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, isTouchDevice, formatCompactNumber } from "@/lib/utils";
import type { OneTimeEvent, RecurringItem } from "@/lib/investors/financialDataService";

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
  subscriptionRevenue?: number;
  standardRevenue?: number;
  subscriptionDetails?: Array<{
    name: string;
    users: number;
    pricePerUser: number;
    total: number;
    growthFactor: number;
  }>;
}

interface BurnRateChartProps {
  currentBalance: number;
  monthlyBurnRate: number;
  monthlyRevenue: number;
  runwayMonths: number | null;
  oneTimeEvents?: OneTimeEvent[];
  recurringRevenues?: RecurringItem[];
  recurringExpenses?: RecurringItem[];
}

export function BurnRateChart({ 
  currentBalance, 
  monthlyBurnRate, 
  monthlyRevenue,
  runwayMonths: dashboardRunwayMonths,
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
      return select("body").append("div")
        .attr("class", className)
        .style("position", "absolute")
        .style("padding", "12px")
        .style("background", "rgba(255, 255, 255, 0.95)")
        .style("border", `1px solid ${borderColor}`)
        .style("border-radius", "8px")
        .style("color", "#1F2937")
        .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)")
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

  // Calculate monthly amount for a recurring item with growth
  const getMonthlyAmount = (item: RecurringItem, monthsFromStart: number = 0): number => {
    if (item.recurring_type === "subscription" && item.subscription_users && item.subscription_price_per_user && item.subscription_growth_factor !== undefined) {
      // Calculate subscription revenue with growth - only users grow, not price
      const monthlyGrowthRate = item.subscription_growth_factor / 100;
      
      // Only calculate user growth, price stays the same
      const userGrowthMultiplier = Math.pow(1 + monthlyGrowthRate, monthsFromStart);
      
      const currentUsers = item.subscription_users * userGrowthMultiplier;
      const currentPrice = item.subscription_price_per_user; // Price stays constant
      
      return currentUsers * currentPrice;
    }
    
    // Standard calculation for non-subscription items
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

    // First, generate all the monthly data points
    for (let i = 0; i < 24; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() + i);
      date.setDate(1); // Set to first of month for consistency
      
      // Calculate actual monthly revenue for this specific month
      let monthlyRevenueForDate = 0;
      let subscriptionRevenueForDate = 0;
      let standardRevenueForDate = 0;
      const subscriptionDetailsForDate: Array<{
        name: string;
        users: number;
        pricePerUser: number;
        total: number;
        growthFactor: number;
      }> = [];

      recurringRevenues.forEach(item => {
        if (isRecurringActive(item, date)) {
          // Calculate months from start for subscription growth
          let monthsFromStart = 0;
          if (item.recurring_type === "subscription" && item.date_info.start_date) {
            const startDate = new Date(item.date_info.start_date);
            monthsFromStart = Math.max(0, (date.getFullYear() - startDate.getFullYear()) * 12 + (date.getMonth() - startDate.getMonth()));
          }
          
          const amount = getMonthlyAmount(item, monthsFromStart);
          monthlyRevenueForDate += amount;
          
          if (item.recurring_type === "subscription" && item.subscription_users && item.subscription_price_per_user && item.subscription_growth_factor !== undefined) {
            subscriptionRevenueForDate += amount;
            
            // Calculate current subscription details for tooltip
            const monthlyGrowthRate = item.subscription_growth_factor / 100;
            const userGrowthMultiplier = Math.pow(1 + monthlyGrowthRate, monthsFromStart);
            
            const currentUsers = Math.round(item.subscription_users * userGrowthMultiplier);
            const currentPrice = item.subscription_price_per_user; // Price stays constant
            
            subscriptionDetailsForDate.push({
              name: item.name || "Subscription",
              users: currentUsers,
              pricePerUser: currentPrice,
              total: amount,
              growthFactor: item.subscription_growth_factor
            });
          } else {
            standardRevenueForDate += amount;
          }
        }
      });
      
      // Calculate actual monthly expenses for this specific month
      let monthlyExpensesForDate = 0;
      recurringExpenses.forEach(item => {
        if (isRecurringActive(item, date)) {
          // Calculate months from start for subscription growth (though expenses typically don't grow like subscriptions)
          let monthsFromStart = 0;
          if (item.recurring_type === "subscription" && item.date_info.start_date) {
            const startDate = new Date(item.date_info.start_date);
            monthsFromStart = Math.max(0, (date.getFullYear() - startDate.getFullYear()) * 12 + (date.getMonth() - startDate.getMonth()));
          }
          monthlyExpensesForDate += getMonthlyAmount(item, monthsFromStart);
        }
      });
      
      // Use calculated values if we have recurring data, otherwise fall back to provided totals
      const currentRevenue = recurringRevenues.length > 0 ? monthlyRevenueForDate : monthlyRevenue;
      const currentExpenses = recurringExpenses.length > 0 ? monthlyExpensesForDate : monthlyBurnRate;
      
      // Calculate baseline revenue (what it would be without growth)
      let baselineRevenue = 0;
      recurringRevenues.forEach(item => {
        if (isRecurringActive(item, date)) {
          if (item.recurring_type === "subscription") {
            // For subscriptions, use base amount without growth
            baselineRevenue += item.amount || 0;
          } else {
            // For standard recurring, use normal calculation
            baselineRevenue += getMonthlyAmount(item, 0);
          }
        }
      });
      
      // Add standard revenue to baseline for subscriptions that don't have growth
      if (recurringRevenues.length === 0) {
        baselineRevenue = monthlyRevenue;
      }
      
      // Calculate the growth amount (difference between current and baseline)
      const baselineSubscriptionRevenue = subscriptionDetailsForDate.reduce((sum, sub) => {
        // Find the original subscription item to get base amount
        const originalItem = recurringRevenues.find(item => 
          item.recurring_type === "subscription" && 
          (item.name || "Subscription") === sub.name
        );
        return sum + (originalItem?.amount || 0);
      }, 0);
      
      const subscriptionGrowthAmount = Math.max(0, subscriptionRevenueForDate - baselineSubscriptionRevenue);
      
      // Debug logging for first few months
      if (i < 3) {
        console.log(`Month ${i}: Subscription Revenue=${subscriptionRevenueForDate}, Baseline=${baselineSubscriptionRevenue}, Growth=${subscriptionGrowthAmount}`);
        if (subscriptionDetailsForDate.length > 0) {
          console.log('Subscription details:', subscriptionDetailsForDate);
        }
      }
      
      // First 3 months are "actual" revenue, rest is projected
      const isActual = i < 3;
      
      data.push({
        date,
        burnRate: currentExpenses,
        revenue: currentRevenue,
        balance: 0, // Will be calculated after we add one-time events
        oneTimeRevenue: undefined,
        oneTimeExpense: undefined,
        oneTimeRevenueName: undefined,
        oneTimeExpenseName: undefined,
        actualRevenue: isActual ? baselineRevenue + standardRevenueForDate : baselineRevenue + standardRevenueForDate,
        projectedRevenue: subscriptionGrowthAmount,
        subscriptionRevenue: subscriptionRevenueForDate,
        standardRevenue: standardRevenueForDate,
        subscriptionDetails: subscriptionDetailsForDate.length > 0 ? subscriptionDetailsForDate : undefined
      });
    }

    // Now process one-time events and add them to the closest data point
    oneTimeEvents.forEach(event => {
      try {
        const eventDate = new Date(event.date);
        
        // Check if date is valid
        if (isNaN(eventDate.getTime())) {
          return;
        }
        
        // Find the closest data point (within the same month)
        const dataPoint = data.find(d => 
          d.date.getFullYear() === eventDate.getFullYear() &&
          d.date.getMonth() === eventDate.getMonth()
        );
        
        if (dataPoint) {
          if (event.type === 'revenue') {
            dataPoint.oneTimeRevenue = (dataPoint.oneTimeRevenue || 0) + event.amount;
            // Combine names if multiple events
            if (dataPoint.oneTimeRevenueName) {
              dataPoint.oneTimeRevenueName += ` + ${event.name}`;
            } else {
              dataPoint.oneTimeRevenueName = event.name;
            }
          } else {
            dataPoint.oneTimeExpense = (dataPoint.oneTimeExpense || 0) + event.amount;
            // Combine names if multiple events
            if (dataPoint.oneTimeExpenseName) {
              dataPoint.oneTimeExpenseName += ` + ${event.name}`;
            } else {
              dataPoint.oneTimeExpenseName = event.name;
            }
          }
        }
      } catch (error) {
        // Skip invalid events
      }
    });

    // Now calculate running balance
    let zeroDateIndex = -1;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      balance = balance - d.burnRate + d.revenue + (d.oneTimeRevenue || 0) - (d.oneTimeExpense || 0);
      d.balance = balance; // Keep actual balance, even if negative
      
      // Mark when we hit zero or go negative
      if (balance <= 0 && zeroDateIndex === -1) {
        zeroDateIndex = i;
        
        // Add one more month after zero to show the trajectory
        if (i < data.length - 1) {
          const nextPoint = data[i + 1];
          const nextBalance = balance - nextPoint.burnRate + nextPoint.revenue + (nextPoint.oneTimeRevenue || 0) - (nextPoint.oneTimeExpense || 0);
          nextPoint.balance = nextBalance;
          zeroDateIndex = i + 1;
        }
        break;
      }
    }

    // If we found a zero date, truncate the data there
    if (zeroDateIndex !== -1) {
      return data.slice(0, zeroDateIndex + 1);
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
    select(svgRef.current).selectAll("*").remove();

    const svg = select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // Create a group for zooming/panning
    const zoomGroup = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
      
    const g = zoomGroup.append("g")
      .attr("transform", `translate(${panX},0) scale(${zoomLevel},1)`);

    // Set up scales
    const xScale = scaleTime()
      .domain(extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const maxValue = Math.max(
      max(data, d => d.burnRate) || 0,
      max(data, d => d.revenue) || 0,
      max(data, d => d.balance) || 0,
      max(data, d => (d.revenue || 0) + (d.oneTimeRevenue || 0)) || 0,
      max(data, d => (d.burnRate || 0) + (d.oneTimeExpense || 0)) || 0,
      currentBalance
    );

    const minValue = Math.min(
      0,
      min(data, d => d.balance) || 0,
      -(max(data, d => d.oneTimeExpense || 0) || 0)
    );

    const yScale = scaleLinear()
      .domain([minValue * 1.1, maxValue * 1.1])
      .range([height, 0]);

    // No gridlines for cleaner look

    // Define line generators
    const burnRateLine = line<ChartDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.burnRate))
      .curve(curveMonotoneX);

    const revenueLine = line<ChartDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.revenue))
      .curve(curveMonotoneX);

    const balanceLine = line<ChartDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(Math.max(0, d.balance)))
      .curve(curveMonotoneX);


    // Calculate bar width based on number of data points
    const barWidth = width / data.length * 0.6;

    // Add zero line if balance goes negative
    if (minValue < 0) {
      g.append("line")
        .attr("class", "zero-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .style("stroke", "#6B7280")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5);
    }

    // Add one-time revenue bars (green)
    g.selectAll(".revenue-bar")
      .data(data.filter(d => d.oneTimeRevenue))
      .enter().append("rect")
      .attr("class", "revenue-bar")
      .attr("x", d => xScale(d.date) - barWidth / 2)
      .attr("y", d => yScale(d.oneTimeRevenue || 0))
      .attr("width", barWidth)
      .attr("height", d => yScale(0) - yScale(d.oneTimeRevenue || 0))
      .attr("fill", "#059669")
      .attr("opacity", 0.8)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        select(this).attr("opacity", 1);
      })
      .on("mouseout", function(event, d) {
        select(this).attr("opacity", 0.8);
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
        select(this).attr("opacity", 1);
      })
      .on("mouseout", function(event, d) {
        select(this).attr("opacity", 0.7);
      });

    // Add the lines
    // Revenue line (green)
    const revenuePath = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#059669")
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
      
    // Add zero date marker if balance hits zero
    const zeroPoint = data.find(d => d.balance <= 0);
    if (zeroPoint) {
      // Vertical line at zero date
      g.append("line")
        .attr("class", "zero-date-line")
        .attr("x1", xScale(zeroPoint.date))
        .attr("x2", xScale(zeroPoint.date))
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#DC2626")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "5,5")
        .style("opacity", 0.6);
        
      // Add "Zero Date" label
      g.append("text")
        .attr("x", xScale(zeroPoint.date))
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("fill", "#DC2626")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text("Zero Date");
        
      // Add circle at zero point
      g.append("circle")
        .attr("cx", xScale(zeroPoint.date))
        .attr("cy", yScale(0))
        .attr("r", 6)
        .style("fill", "#DC2626")
        .style("stroke", "#FFFFFF")
        .style("stroke-width", 2);
    }
      
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
    const bisectDate = bisector<ChartDataPoint, Date>(d => d.date).left;
    
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
          const [mouseX] = pointer(event);
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
            .attr("cy", yScale(Math.max(0, d.balance)))
            .style("opacity", 1);
            
          // Format tooltip content
          const tooltipHtml = `
            <div style="font-weight: 600; margin-bottom: 8px; color: #A78BFA;">
              ${timeFormat("%B %Y")(d.date)}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #6B7280;">Balance:</span> 
              <span style="font-weight: 600;">${formatCurrency(d.balance)}</span>
            </div>
            <div>
              <span style="color: #6B7280;">Net Burn:</span> 
              <span style="font-weight: 600; color: ${netBurn > 0 ? '#DC2626' : '#059669'}">
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
          const [mouseX] = pointer(event);
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
            .attr("cy", yScale(Math.max(0, d.balance)))
            .style("opacity", 1);
          
          // Set active tooltip for mobile
          const tooltipContent = `
            <div class="font-bold mb-2 text-cosmic-purple">
              ${timeFormat("%B %Y")(d.date)}
            </div>
            <div class="mb-1">
              <span class="text-gray-500">Balance:</span> 
              <span class="font-semibold">${formatCurrency(d.balance)}</span>
            </div>
            <div>
              <span class="text-gray-500">Net Burn:</span> 
              <span class="font-semibold ${netBurn > 0 ? 'text-red-600' : 'text-green-600'}">
                ${formatCurrency(Math.abs(netBurn))}/mo
              </span>
            </div>
          `;
          
          // Adjust tooltip position for zoom and pan
          const tooltipX = xScale(d.date) * zoomLevel + margin.left + panX;
          const tooltipY = yScale(Math.max(0, d.balance)) + margin.top;
          
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
          const [mouseX] = pointer(event);
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
          let subscriptionDetailsHtml = '';
          
          if (d.subscriptionDetails && d.subscriptionDetails.length > 0) {
            subscriptionDetailsHtml = `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
                <div style="font-weight: 600; margin-bottom: 4px; color: #A78BFA;">Subscription Breakdown:</div>
                ${d.subscriptionDetails.map(sub => `
                  <div style="margin-bottom: 4px; font-size: 11px;">
                    <div style="font-weight: 500; color: #374151;">${sub.name}</div>
                    <div style="color: #6B7280;">
                      ${sub.users.toLocaleString()} users × ${formatCurrency(sub.pricePerUser)} = ${formatCurrency(sub.total)}
                    </div>
                    <div style="color: #9CA3AF; font-size: 10px;">
                      Growing at ${sub.growthFactor}%/month
                    </div>
                  </div>
                `).join('')}
              </div>
            `;
          }
          
          const tooltipHtml = `
            <div style="font-weight: 600; margin-bottom: 8px; color: #10B981;">
              ${timeFormat("%B %Y")(d.date)}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #6B7280;">Total Revenue:</span> 
              <span style="font-weight: 600;">${formatCurrency(d.revenue)}</span>
            </div>
            ${d.subscriptionRevenue ? `
              <div style="margin-bottom: 4px;">
                <span style="color: #6B7280;">Subscription:</span> 
                <span style="font-weight: 600; color: #A78BFA;">${formatCurrency(d.subscriptionRevenue)}</span>
              </div>
            ` : ''}
            ${d.standardRevenue ? `
              <div style="margin-bottom: 4px;">
                <span style="color: #6B7280;">Standard Recurring:</span> 
                <span style="font-weight: 600; color: #10B981;">${formatCurrency(d.standardRevenue)}</span>
              </div>
            ` : ''}
            <div>
              <span style="color: #6B7280;">Subscription Growth:</span> 
              <span style="font-weight: 600; color: #A78BFA;">
                ${d.projectedRevenue ? formatCurrency(d.projectedRevenue) : "$0"}
              </span>
            </div>
            ${subscriptionDetailsHtml}
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
          const [mouseX] = pointer(event);
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
          let mobileSubscriptionDetailsHtml = '';
          
          if (d.subscriptionDetails && d.subscriptionDetails.length > 0) {
            mobileSubscriptionDetailsHtml = `
              <div class="mt-3 pt-3 border-t border-gray-200">
                <div class="font-semibold mb-2 text-cosmic-purple text-sm">Subscription Breakdown:</div>
                ${d.subscriptionDetails.map(sub => `
                  <div class="mb-2 text-xs">
                    <div class="font-medium text-gray-800">${sub.name}</div>
                    <div class="text-gray-600">
                      ${sub.users.toLocaleString()} users × ${formatCurrency(sub.pricePerUser)} = ${formatCurrency(sub.total)}
                    </div>
                    <div class="text-gray-500 text-xs">
                      Growing at ${sub.growthFactor}%/month
                    </div>
                  </div>
                `).join('')}
              </div>
            `;
          }
          
          const tooltipContent = `
            <div class="font-bold mb-2 text-green-600">
              ${timeFormat("%B %Y")(d.date)}
            </div>
            <div class="mb-1">
              <span class="text-gray-500">Total Revenue:</span> 
              <span class="font-semibold">${formatCurrency(d.revenue)}</span>
            </div>
            ${d.subscriptionRevenue ? `
              <div class="mb-1">
                <span class="text-gray-500">Subscription:</span> 
                <span class="font-semibold text-cosmic-purple">${formatCurrency(d.subscriptionRevenue)}</span>
              </div>
            ` : ''}
            ${d.standardRevenue ? `
              <div class="mb-1">
                <span class="text-gray-500">Standard Recurring:</span> 
                <span class="font-semibold text-green-600">${formatCurrency(d.standardRevenue)}</span>
              </div>
            ` : ''}
            <div>
              <span class="text-gray-500">Subscription Growth:</span> 
              <span class="font-semibold text-cosmic-purple">
                ${d.projectedRevenue ? formatCurrency(d.projectedRevenue) : "$0"}
              </span>
            </div>
            ${mobileSubscriptionDetailsHtml}
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
          select(this).attr("opacity", 1);
          
          const tooltipHtml = `
            <div style="font-weight: 600; margin-bottom: 4px; color: #059669;">
              ${d.oneTimeRevenueName || "One-time Revenue"}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #6B7280;">Date:</span> 
              <span style="font-weight: 600;">${timeFormat("%B %d, %Y")(d.date)}</span>
            </div>
            <div>
              <span style="color: #6B7280;">Amount:</span> 
              <span style="font-weight: 600;">+${formatCurrency(d.oneTimeRevenue || 0)}</span>
            </div>
          `;
          
          if (barTooltip) {
            barTooltip
              .html(tooltipHtml)
              .style("border", "1px solid #059669")
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
        select(this).attr("opacity", 0.8);
        if (barTooltip) barTooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        if (isTouchDevice()) {
          select(this).attr("opacity", 1);
          
          const tooltipContent = `
            <div class="font-bold mb-1 text-green-600">
              ${d.oneTimeRevenueName || "One-time Revenue"}
            </div>
            <div class="mb-1">
              <span class="text-gray-500">Date:</span> 
              <span class="font-semibold">${timeFormat("%B %d, %Y")(d.date)}</span>
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
            select(this).attr("opacity", 0.8);
            setActiveTooltip(null);
          }, 2000);
        }
      });
      
    // Update expense bar interactions
    g.selectAll(".expense-bar")
      .on("mouseover", function(event, d) {
        if (!isTouchDevice()) {
          select(this).attr("opacity", 1);
          
          const tooltipHtml = `
            <div style="font-weight: 600; margin-bottom: 4px; color: #DC2626;">
              ${d.oneTimeExpenseName || "One-time Expense"}
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #6B7280;">Date:</span> 
              <span style="font-weight: 600;">${timeFormat("%B %d, %Y")(d.date)}</span>
            </div>
            <div>
              <span style="color: #6B7280;">Amount:</span> 
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
        select(this).attr("opacity", 0.7);
        if (barTooltip) barTooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        if (isTouchDevice()) {
          select(this).attr("opacity", 1);
          
          const tooltipContent = `
            <div class="font-bold mb-1 text-red-600">
              ${d.oneTimeExpenseName || "One-time Expense"}
            </div>
            <div class="mb-1">
              <span class="text-gray-500">Date:</span> 
              <span class="font-semibold">${timeFormat("%B %d, %Y")(d.date)}</span>
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
            select(this).attr("opacity", 0.7);
            setActiveTooltip(null);
          }, 2000);
        }
      });

    // Add axes - X-axis at bottom of chart
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${height})`);
      
    if (isMobile) {
      // Mobile: Show fewer ticks and rotate more
      xAxis.call(axisBottom(xScale)
        .ticks(6)
        .tickFormat(d => timeFormat("%b")(d as Date)))
        .style("color", "#6B7280")
        .style("font-size", "10px")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-60)");
    } else {
      // Desktop: Normal display
      xAxis.call(axisBottom(xScale)
        .tickFormat(d => timeFormat("%b %Y")(d as Date)))
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
      .call(axisLeft(yScale)
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
      selectAll("[class^='vergil-chart-tooltip']").remove();
    };
  }, []);

  const netBurn = monthlyBurnRate - monthlyRevenue;
  const runwayMonths = dashboardRunwayMonths;

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
                <div className="w-5 h-0.5 bg-green-600"></div>
                <span className="text-[10px] sm:text-xs text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 opacity-80 rounded-sm"></div>
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
            <p className={`text-lg sm:text-2xl font-bold font-display ${netBurn > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {netBurn > 0 ? `-${formatCurrency(Math.abs(netBurn))}` : formatCurrency(Math.abs(netBurn))}
              <span className="text-xs sm:text-sm font-normal text-gray-600 ml-1">/ mo</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Runway: <span className="font-semibold">
                {runwayMonths !== null ? `${runwayMonths} months` : '∞'}
              </span>
            </p>
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
                className="absolute bg-white/95 border border-gray-200 rounded-lg p-3 text-sm z-10 shadow-lg"
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