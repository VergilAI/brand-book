"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as d3 from "d3";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  source: string;
  amount: number;
  type: string;
  transaction_type: string;
  date_info: any;
}

export function AggregateCharts() {
  const [revenueData, setRevenueData] = useState<Transaction[]>([]);
  const [expenseData, setExpenseData] = useState<Transaction[]>([]);
  const [dateFilter, setDateFilter] = useState<"all" | "month" | "quarter" | "year">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "onetime" | "recurring">("all");
  
  const revenueChartRef = useRef<SVGSVGElement>(null);
  const expenseChartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    try {
      drawChart(revenueChartRef.current, filterData(revenueData), "#00D9FF");
      drawChart(expenseChartRef.current, filterData(expenseData), "#EF4444");
    } catch (error) {
      console.error('Error updating charts:', error);
    }
  }, [revenueData, expenseData, dateFilter, typeFilter]);
  
  // Cleanup function
  useEffect(() => {
    return () => {
      if (revenueChartRef.current) {
        const svg = d3.select(revenueChartRef.current);
        svg.selectAll("*").remove();
      }
      if (expenseChartRef.current) {
        const svg = d3.select(expenseChartRef.current);
        svg.selectAll("*").remove();
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const [revResponse, expResponse] = await Promise.all([
        fetch("/api/investors/analytics/revenue-breakdown"),
        fetch("/api/investors/analytics/expense-breakdown")
      ]);
      
      if (!revResponse.ok || !expResponse.ok) {
        throw new Error('Failed to fetch chart data');
      }
      
      const revData = await revResponse.json();
      const expData = await expResponse.json();
      
      // Validate data structure
      if (!Array.isArray(revData) || !Array.isArray(expData)) {
        throw new Error('Invalid data format received');
      }
      
      setRevenueData(revData);
      setExpenseData(expData);
    } catch (error) {
      console.error("Error fetching aggregate data:", error);
      // Set empty arrays to prevent rendering issues
      setRevenueData([]);
      setExpenseData([]);
    }
  };

  const filterData = (data: Transaction[]) => {
    return data.filter(item => {
      if (typeFilter !== "all" && item.transaction_type !== typeFilter) return false;
      return true;
    });
  };

  const drawChart = (svgElement: SVGSVGElement | null, data: Transaction[], color: string) => {
    if (!svgElement) return;
    
    const svg = d3.select(svgElement);
    
    // Clean up previous chart
    try {
      svg.selectAll("*").remove();
    } catch (error) {
      console.error('Error clearing chart:', error);
      return;
    }
    
    // Handle empty data
    if (!data || data.length === 0) {
      svg.append("text")
        .attr("x", 190)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .attr("fill", "#9CA3AF")
        .text("No data available");
      return;
    }

    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const width = 380 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    let aggregatedData, sortedData;
    try {
      // Validate data structure
      const validData = data.filter(d => 
        d && 
        typeof d.amount === 'number' && 
        !isNaN(d.amount) && 
        d.source && 
        typeof d.source === 'string'
      );
      
      if (validData.length === 0) {
        svg.append("text")
          .attr("x", 190)
          .attr("y", 150)
          .attr("text-anchor", "middle")
          .attr("fill", "#9CA3AF")
          .text("No valid data available");
        return;
      }
      
      aggregatedData = d3.rollup(
        validData,
        v => d3.sum(v, d => d.amount),
        d => d.source
      );

      sortedData = Array.from(aggregatedData, ([source, amount]) => ({ source, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);
    } catch (error) {
      console.error('Error processing chart data:', error);
      return;
    }

    let xScale, yScale;
    try {
      xScale = d3.scaleBand()
        .domain(sortedData.map(d => d.source))
        .range([0, width])
        .padding(0.1);

      const maxAmount = d3.max(sortedData, d => d.amount) || 1000; // Minimum scale
      yScale = d3.scaleLinear()
        .domain([0, maxAmount])
        .nice()
        .range([height, 0]);
    } catch (error) {
      console.error('Error creating chart scales:', error);
      return;
    }

    // Draw bars with error handling
    try {
      g.selectAll(".bar")
        .data(sortedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.source) || 0)
        .attr("width", xScale.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .attr("fill", color)
        .attr("opacity", 0.8)
        .transition()
        .duration(800)
        .attr("y", d => yScale(d.amount))
        .attr("height", d => height - yScale(d.amount));
    } catch (error) {
      console.error('Error drawing chart bars:', error);
    }

    // Draw axes with error handling
    try {
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");

      g.append("g")
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
    } catch (error) {
      console.error('Error drawing chart axes:', error);
    }

    // Style chart with error handling
    try {
      g.selectAll(".domain").attr("stroke", "#374151");
      g.selectAll(".tick line").attr("stroke", "#374151");
      g.selectAll(".tick text").attr("fill", "#9CA3AF");
    } catch (error) {
      console.error('Error styling chart:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          <Button
            variant={dateFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("all")}
          >
            All Time
          </Button>
          <Button
            variant={dateFilter === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("month")}
          >
            This Month
          </Button>
          <Button
            variant={dateFilter === "quarter" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("quarter")}
          >
            This Quarter
          </Button>
          <Button
            variant={dateFilter === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("year")}
          >
            This Year
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={typeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("all")}
          >
            All Types
          </Button>
          <Button
            variant={typeFilter === "onetime" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("onetime")}
          >
            One-time
          </Button>
          <Button
            variant={typeFilter === "recurring" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("recurring")}
          >
            Recurring
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
          <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
            <CardTitle className="text-cosmic-purple font-display flex items-center gap-2">
              <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <svg ref={revenueChartRef} width="100%" height="300" viewBox="0 0 380 300" />
          </CardContent>
        </Card>

        <Card variant="default" className="bg-white border-cosmic-purple/20 shadow-lg">
          <CardHeader className="border-b border-cosmic-purple/10 bg-gradient-to-r from-cosmic-purple/5 to-transparent">
            <CardTitle className="text-cosmic-purple font-display flex items-center gap-2">
              <div className="w-1 h-6 bg-cosmic-purple rounded-full"></div>
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <svg ref={expenseChartRef} width="100%" height="300" viewBox="0 0 380 300" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}