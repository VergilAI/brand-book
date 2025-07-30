import React from 'react';
import { Button } from '@/components/atomic/button';

interface LineControlsProps {
  lineType: 'straight' | 'elbow' | 'curved';
  onLineTypeChange: (type: 'straight' | 'elbow' | 'curved') => void;
  connectionMode: 'smart' | 'manual';
  onConnectionModeChange: (mode: 'smart' | 'manual') => void;
}

export function LineControls({ 
  lineType, 
  onLineTypeChange, 
  connectionMode, 
  onConnectionModeChange 
}: LineControlsProps) {
  return (
    <div className="flex items-center gap-spacing-sm"> {/* 8px */}
      {/* Line Type Selector */}
      <div className="flex items-center gap-spacing-xs"> {/* 4px */}
        <span className="text-sm font-medium text-text-secondary">Line:</span> {/* #6C6C6D */}
        <div className="flex rounded-md shadow-sm">
          <Button
            size="sm"
            variant={lineType === 'straight' ? 'primary' : 'ghost'}
            className={`rounded-r-none ${lineType === 'straight' ? '' : 'border-r-0'}`}
            onClick={() => onLineTypeChange('straight')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Button>
          <Button
            size="sm"
            variant={lineType === 'elbow' ? 'primary' : 'ghost'}
            className={`rounded-none ${lineType === 'elbow' ? '' : 'border-x-0'}`}
            onClick={() => onLineTypeChange('elbow')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4L8 4L8 12L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          <Button
            size="sm"
            variant={lineType === 'curved' ? 'primary' : 'ghost'}
            className={`rounded-l-none ${lineType === 'curved' ? '' : 'border-l-0'}`}
            onClick={() => onLineTypeChange('curved')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8Q8 2 14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Connection Mode */}
      <div className="flex items-center gap-spacing-xs"> {/* 4px */}
        <span className="text-sm font-medium text-text-secondary">Mode:</span> {/* #6C6C6D */}
        <select 
          value={connectionMode} 
          onChange={(e) => onConnectionModeChange(e.target.value as 'smart' | 'manual')}
          className="h-8 px-spacing-sm text-sm border border-border-default rounded-md bg-bg-primary" // border: rgba(0,0,0,0.1), bg: #FFFFFF
        >
          <option value="smart">Smart</option>
          <option value="manual">Manual</option>
        </select>
      </div>
    </div>
  );
}