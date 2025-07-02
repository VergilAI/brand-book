'use client';

import { useState } from 'react';
import { Table, BarChart3, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TableBuilder } from '../TableBuilder';
import { ChartVisualizer } from '../ChartVisualizer';

type Tool = 'table' | 'chart' | null;

export function ToolsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>(null);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveTool(null);
    }
  };

  const selectTool = (tool: Tool) => {
    setActiveTool(tool);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePanel}
          className={cn(
            "rounded-l-lg rounded-r-none h-20 w-6 bg-pure-light dark:bg-gray-800",
            "border-r-0 hover:bg-mist-gray dark:hover:bg-gray-700",
            "transition-all duration-300",
            isOpen && "translate-x-0"
          )}
        >
          {isOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Tools Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full bg-soft-light dark:bg-gray-900",
          "border-l border-mist-gray dark:border-gray-700",
          "transition-transform duration-300 ease-in-out z-30",
          "w-96 shadow-xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-mist-gray dark:border-gray-700">
          <h2 className="text-lg font-semibold text-deep-space dark:text-pure-light">
            Tools
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tool Selection */}
        <div className="p-4 space-y-2 border-b border-mist-gray dark:border-gray-700">
          <Button
            variant={activeTool === 'table' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => selectTool('table')}
          >
            <Table className="mr-2 h-4 w-4" />
            Table Builder
          </Button>
          <Button
            variant={activeTool === 'chart' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => selectTool('chart')}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Chart Visualizer
          </Button>
        </div>

        {/* Tool Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTool === 'table' && <TableBuilder />}
          {activeTool === 'chart' && <ChartVisualizer />}
          {!activeTool && (
            <div className="text-center text-stone-gray dark:text-gray-500 mt-8">
              <p>Select a tool to get started</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}