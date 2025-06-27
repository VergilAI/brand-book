"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as d3 from "d3";
import { formatCurrency } from "@/lib/utils";

interface BurnrateChartProps {
  currentBalance: number;
  burnrate: number;
  monthlyRevenue?: number;
  hypotheticalRevenue?: number;
}

interface MonthlyProjection {
  date: string;
  month: string;
  revenue: number;
  expense: number;
  hypothetical_revenue: number;
  net_change: number;
  net_change_with_hypothetical: number;
  balance_without_hypothetical: number;
  balance_with_hypothetical: number;
}

export function BurnrateChart({ currentBalance, burnrate, monthlyRevenue = 0, hypotheticalRevenue = 0 }: BurnrateChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [projections, setProjections] = useState<MonthlyProjection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch monthly projections
  useEffect(() => {
    const fetchProjections = async () => {
      try {
        const response = await fetch('/api/investors/analytics/monthly-projections?months=24');
        if (!response.ok) {
          throw new Error(`Failed to fetch projections: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched projections:', data);
        if (Array.isArray(data)) {
          setProjections(data);
        } else {
          console.error('Invalid projections data:', data);
        }
      } catch (error) {
        console.error('Error fetching projections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjections();
  }, [currentBalance, burnrate, monthlyRevenue, hypotheticalRevenue]);

  useEffect(() => {
    console.log('BurnrateChart received data:', { currentBalance, burnrate, monthlyRevenue, hypotheticalRevenue });
    console.log('Projections:', projections);
    
    if (!svgRef.current || loading || projections.length === 0) {
      console.log('Not ready to render chart');
      return;
    }
    
    // Convert string values to numbers if needed
    const balance = typeof currentBalance === 'number' ? currentBalance : parseFloat(currentBalance as any) || 0;
    const burn = typeof burnrate === 'number' ? burnrate : parseFloat(burnrate as any) || 0;

    const svg = d3.select(svgRef.current);
    
    // Clean up previous chart
    try {
      svg.selectAll("*").remove();
    } catch (error) {
      console.error('Error clearing chart:', error);
      return;
    }

    const margin = { top: 20, right: 30, bottom: 60, left: 80 }; // Increased bottom margin for labels
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Transform projection data for D3
    const data = projections && projections.length > 0 ? projections.map((proj, i) => ({
      month: i,
      date: new Date(proj.date),
      balance: proj.balance_without_hypothetical,
      balanceWithRevenue: proj.balance_with_hypothetical,
      label: new Date(proj.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      revenue: proj.revenue,
      expense: proj.expense,
      hypotheticalRevenue: proj.hypothetical_revenue
    })) : [];
    
    console.log('Chart data:', data.slice(0, 5)); // Log first 5 points
    
    if (data.length === 0) {
      console.log('No data to render');
      return;
    }

    let xScale, yScale;
    try {
      // Create time scale for x-axis
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 24);
      
      xScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, width]);

      // Calculate max balance considering potential growth
      const maxProjectedBalance = Math.max(...data.map(d => Math.max(d.balance, d.balanceWithRevenue)));
      const maxBalance = Math.max(maxProjectedBalance * 1.1, balance * 1.1, 1000); // Minimum scale of $1000
      yScale = d3.scaleLinear()
        .domain([0, maxBalance])
        .range([height, 0]);
    } catch (error) {
      console.error('Error creating scales:', error);
      return;
    }

    let line, area, lineWithRevenue;
    try {
      // Line for burn only
      line = d3.line<any>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.balance))
        .curve(d3.curveMonotoneX);

      // Area for burn only
      area = d3.area<any>()
        .x(d => xScale(d.date))
        .y0(height)
        .y1(d => yScale(d.balance))
        .curve(d3.curveMonotoneX);
        
      // Line for balance with potential revenue
      lineWithRevenue = d3.line<any>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.balanceWithRevenue))
        .curve(d3.curveMonotoneX);
    } catch (error) {
      console.error('Error creating line/area generators:', error);
      return;
    }

    // Create gradient with dark purple theme
    try {
      g.append("defs")
        .append("linearGradient")
        .attr("id", "burnGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", 0).attr("y2", height)
        .selectAll("stop")
        .data([
          { offset: "0%", color: "rgba(99, 102, 241, 0.4)" },  // cosmic-purple with opacity
          { offset: "100%", color: "rgba(99, 102, 241, 0.1)" }   // cosmic-purple faded
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
    } catch (error) {
      console.error('Error creating gradient:', error);
    }

    // Draw area and line with dark purple theme
    try {
      // Area for burn-only scenario
      g.append("path")
        .datum(data)
        .attr("fill", "url(#burnGradient)")
        .attr("opacity", 0.5)
        .attr("d", area);

      // Line for burn-only scenario
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#6366F1")  // cosmic-purple
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5") // Dashed for burn-only
        .attr("d", line);
        
      // Line for balance with potential revenue
      if (potentialRevenue > 0) {
        g.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#00D9FF")  // phosphor-cyan for revenue scenario
          .attr("stroke-width", 3)
          .attr("d", lineWithRevenue);
          
        // Add legend
        const legendY = -10;
        
        // Burn-only legend
        g.append("line")
          .attr("x1", width - 200)
          .attr("x2", width - 170)
          .attr("y1", legendY)
          .attr("y2", legendY)
          .attr("stroke", "#6366F1")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5");
          
        g.append("text")
          .attr("x", width - 165)
          .attr("y", legendY + 4)
          .attr("fill", "#374151")
          .attr("font-size", "12px")
          .text("Current Burn");
          
        // With revenue legend
        g.append("line")
          .attr("x1", width - 200)
          .attr("x2", width - 170)
          .attr("y1", legendY + 20)
          .attr("y2", legendY + 20)
          .attr("stroke", "#00D9FF")
          .attr("stroke-width", 3);
          
        g.append("text")
          .attr("x", width - 165)
          .attr("y", legendY + 24)
          .attr("fill", "#374151")
          .attr("font-size", "12px")
          .text("With Potential Revenue");
      }
        
      // Add critical zone indicator (when balance gets low)
      const criticalThreshold = balance * 0.2; // 20% of starting balance
      if (criticalThreshold > 0) {
        g.append("line")
          .attr("x1", 0)
          .attr("x2", width)
          .attr("y1", yScale(criticalThreshold))
          .attr("y2", yScale(criticalThreshold))
          .attr("stroke", "#EF4444")  // red warning line
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("opacity", 0.7);
          
        // Add critical zone label
        g.append("text")
          .attr("x", width - 10)
          .attr("y", yScale(criticalThreshold) - 5)
          .attr("fill", "#EF4444")
          .attr("text-anchor", "end")
          .attr("font-size", "12px")
          .text("Critical Level");
      }
      
      // Find zero balance points
      const zeroBalanceIndex = data.findIndex(d => d.balance <= 0);
      const zeroBalanceWithRevenueIndex = data.findIndex(d => d.balanceWithRevenue <= 0);
      
      if (zeroBalanceIndex > 0 && zeroBalanceIndex < data.length) {
        const zeroDate = data[zeroBalanceIndex].date;
        
        g.append("line")
          .attr("x1", xScale(zeroDate))
          .attr("x2", xScale(zeroDate))
          .attr("y1", 0)
          .attr("y2", height)
          .attr("stroke", "#DC2626")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "3,3")
          .attr("opacity", 0.5);
          
        g.append("text")
          .attr("x", xScale(zeroDate) + 5)
          .attr("y", 40)
          .attr("fill", "#DC2626")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text(`Zero (${zeroBalanceIndex} months)`);
      }
      
      if (zeroBalanceWithRevenueIndex > 0 && zeroBalanceWithRevenueIndex < data.length) {
        const zeroDateWithRevenue = data[zeroBalanceWithRevenueIndex].date;
        
        g.append("line")
          .attr("x1", xScale(zeroDateWithRevenue))
          .attr("x2", xScale(zeroDateWithRevenue))
          .attr("y1", 0)
          .attr("y2", height)
          .attr("stroke", "#00D9FF")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "3,3")
          .attr("opacity", 0.8);
          
        g.append("text")
          .attr("x", xScale(zeroDateWithRevenue) + 5)
          .attr("y", 20)
          .attr("fill", "#00D9FF")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text(`Zero (${zeroBalanceWithRevenueIndex} months)`);
      } else if (data[data.length - 1].balanceWithRevenue > data[0].balanceWithRevenue) {
        // Company is growing with revenue
        g.append("text")
          .attr("x", width - 10)
          .attr("y", 20)
          .attr("fill", "#10B981")
          .attr("text-anchor", "end")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text("Growing with revenue!");
      }
    } catch (error) {
      console.error('Error drawing chart paths:', error);
    }

    // Draw axes with dark theme
    try {
      // X-axis (Time) with month labels
      const xAxis = g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
          .ticks(d3.timeMonth.every(1)) // Show every month
          .tickFormat(d => {
            const date = d as Date;
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          })
        );
        
      // Rotate x-axis labels for better readability
      xAxis.selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("font-size", "10px"); // Smaller font for monthly labels
        
      xAxis.append("text")
        .attr("x", width / 2)
        .attr("y", 50) // Move down to avoid overlapping with rotated labels
        .attr("fill", "#1F2937")  // dark gray for visibility on white
        .attr("font-weight", "600")
        .style("text-anchor", "middle")
        .attr("transform", "rotate(0)")
        .text("Timeline");

      // Y-axis (Money)
      const yAxis = g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d => {
          const value = d as number;
          if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M Ft`;
          } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k Ft`;
          } else {
            return `${value.toFixed(0)} Ft`;
          }
        }));
        
      yAxis.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -height / 2)
        .attr("fill", "#1F2937")  // dark gray for visibility on white
        .attr("font-weight", "600")
        .style("text-anchor", "middle")
        .text("Company Balance (HUF)");
    } catch (error) {
      console.error('Error drawing axes:', error);
    }

    // Style axes with dark theme
    try {
      g.selectAll(".domain").attr("stroke", "#1F2937").attr("stroke-width", 2);
      g.selectAll(".tick line").attr("stroke", "#6B7280").attr("stroke-width", 1);
      g.selectAll(".tick text").attr("fill", "#374151").attr("font-size", "12px");
      
      // Add grid lines for better readability
      g.selectAll(".tick line")
        .clone()
        .attr("stroke", "#E5E7EB")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.5)
        .attr("x2", width)
        .attr("y2", 0);
    } catch (error) {
      console.error('Error styling chart:', error);
    }

  }, [currentBalance, burnrate, projections, loading]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
      }
    };
  }, []);

  return (
    <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
      <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
        <CardTitle className="text-cosmic-purple font-display text-xl flex items-center gap-2">
          <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
          Runway Projection
        </CardTitle>
        <p className="text-sm text-gray-600">
          Current burn rate: {formatCurrency(Math.abs(burnrate))}/month
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-cosmic-purple">Loading projections...</div>
          </div>
        ) : (
          <div>
            <svg ref={svgRef} width="100%" height="400" viewBox="0 0 800 400" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}