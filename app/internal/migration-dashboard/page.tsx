'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ColorMigrationTab } from './components/ColorMigrationTab';
import { 
  RefreshCw, 
  Palette,
  Type,
  Box,
  Layers,
  Activity
} from 'lucide-react';

type TabType = 'colors' | 'spacing' | 'typography' | 'shadows' | 'all';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  description: string;
  implemented: boolean;
}

const tabs: TabConfig[] = [
  {
    id: 'colors',
    label: 'Colors',
    icon: <Palette className="w-4 h-4" />,
    description: 'Track color token migration progress',
    implemented: true
  },
  {
    id: 'spacing',
    label: 'Spacing',
    icon: <Box className="w-4 h-4" />,
    description: 'Track spacing token migration progress',
    implemented: false
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: <Type className="w-4 h-4" />,
    description: 'Track typography token migration progress',
    implemented: false
  },
  {
    id: 'shadows',
    label: 'Shadows',
    icon: <Layers className="w-4 h-4" />,
    description: 'Track shadow token migration progress',
    implemented: false
  },
  {
    id: 'all',
    label: 'Overview',
    icon: <Activity className="w-4 h-4" />,
    description: 'Overall migration progress',
    implemented: false
  }
];

export default function MigrationDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Trigger the color analysis
    try {
      const response = await fetch('/api/migration/analyze-colors', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to run analysis');
      }
      
      const result = await response.json();
      setLastUpdate(new Date());
      
      // Reload the tab content
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh:', error);
      alert('Failed to run color analysis. Check console for details.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Token Migration Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage design token adoption across your codebase
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-vergil-purple text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.implemented && setActiveTab(tab.id)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${!tab.implemented ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  ${activeTab === tab.id
                    ? 'border-vergil-purple text-vergil-purple'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                disabled={!tab.implemented}
              >
                {tab.icon}
                {tab.label}
                {!tab.implemented && (
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Coming Soon</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'colors' && <ColorMigrationTab />}
          
          {activeTab !== 'colors' && (
            <Card className="p-12 text-center">
              <div className="text-gray-400">
                {tabs.find(t => t.id === activeTab)?.icon}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label} Migration
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {tabs.find(t => t.id === activeTab)?.description}
              </p>
              <p className="mt-4 text-xs text-gray-400">
                This feature is coming soon
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}