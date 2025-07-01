'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { tokens } from '@/generated/tokens';
import { ComponentDetailModal } from './components/ComponentDetailModal';
import { ColorInventory } from './components/ColorInventory';
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Download,
  Zap,
  Eye,
  Code,
  GitBranch
} from 'lucide-react';

interface DashboardData {
  summary: {
    healthScore: number;
    totalComponents: number;
    totalViolations: number;
    tokenAdoption: number;
    weeklyChange: {
      components: number;
      violations: number;
      tokens: number;
      coverage: number;
    };
  };
  metrics: {
    components: { total: number; change: number };
    hardcoded: { total: number; change: number };
    tokens: { total: number; change: number };
    coverage: { percentage: number; change: number };
    colors: { total: number; inTS: number; inCSS: number; inBoth: number; inYAML: number };
    spacing: { total: number; inCSS: number };
    typography: { total: number; inBoth: number };
    shadows: { total: number; inYAML: number };
  };
  components: ComponentHealth[];
  violations: ViolationsByType;
  directoryTree: DirectoryNode;
  activity: ActivityItem[];
}

interface ComponentHealth {
  id: string;
  name: string;
  path: string;
  category: string;
  coverage: number;
  violations: number;
  status: 'clean' | 'warning' | 'error';
  lastModified: string;
  violationDetails?: ViolationDetail[];
}

interface ViolationDetail {
  type: string;
  value: string;
  line: number;
  count: number;
  suggestedToken?: string;
}

interface ViolationsByType {
  colors: ColorViolation[];
  spacing: Violation[];
  typography: Violation[];
  shadows: Violation[];
}

interface ColorViolation extends Violation {
  hex: string;
  suggestedToken: string;
  confidence: number;
}

interface Violation {
  value: string;
  instances: number;
  files: string[];
}

interface DirectoryNode {
  name: string;
  path: string;
  violations: number;
  status: 'clean' | 'warning' | 'error';
  children?: DirectoryNode[];
}

interface ActivityItem {
  timestamp: string;
  type: 'migration' | 'violation' | 'fix';
  user?: string;
  message: string;
  details?: string;
}

export default function MigrationDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'clean' | 'warning' | 'error'>('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/migration/summary');
      const data = await response.json();
      setData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 50) return <AlertCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };


  const toggleDirectory = (path: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading migration dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Migration Progress Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Last Updated: {lastUpdate.toLocaleString()}
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-vergil-purple text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Overall Health Score</h2>
            <div className={`flex items-center gap-2 ${getHealthColor(data.summary.healthScore)}`}>
              {getHealthIcon(data.summary.healthScore)}
              <span className="text-2xl font-bold">{data.summary.healthScore}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                data.summary.healthScore >= 80 ? 'bg-green-500' :
                data.summary.healthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${data.summary.healthScore}%` }}
            />
          </div>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Components"
            value={data.metrics.components.total}
            change={data.metrics.components.change}
            unit="total"
          />
          <MetricCard
            title="Hardcoded Values"
            value={data.metrics.hardcoded.total}
            change={data.metrics.hardcoded.change}
            trend="negative"
          />
          <MetricCard
            title="Token Usage"
            value={data.metrics.tokens.total}
            change={data.metrics.tokens.change}
          />
          <MetricCard
            title="Coverage"
            value={data.metrics.coverage.percentage}
            change={data.metrics.coverage.change}
            unit="%"
          />
        </div>

        {/* Color Distribution */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Token Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-vergil-purple">{data.metrics.colors.total}</div>
              <div className="text-sm text-gray-600">Colors Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{data.metrics.colors.inTS}</div>
              <div className="text-sm text-gray-600">in TypeScript</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{data.metrics.colors.inCSS}</div>
              <div className="text-sm text-gray-600">in CSS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{data.metrics.colors.inYAML}</div>
              <div className="text-sm text-gray-600">in YAML</div>
            </div>
          </div>
        </Card>

        {/* Color Inventory */}
        <ColorInventory />

        {/* Component Health Matrix */}
        <Card className="p-6 mb-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Component Health Matrix</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md text-sm"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="clean">Clean</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
          <ComponentHealthTable 
            components={data.components}
            searchQuery={searchQuery}
            filterStatus={filterStatus}
            onSelectComponent={setSelectedComponent}
          />
        </Card>

        {/* Directory Heat Map */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Directory Heat Map</h3>
          <DirectoryTree 
            node={data.directoryTree}
            expandedDirs={expandedDirs}
            onToggle={toggleDirectory}
          />
        </Card>

        {/* Component Detail Modal */}
        {selectedComponent && (
          <ComponentDetailModal
            componentId={selectedComponent}
            onClose={() => setSelectedComponent(null)}
          />
        )}

        {/* Real-time Activity Feed */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
          <ActivityFeed activities={data.activity} />
        </Card>
      </div>
    </div>
  );
}

// Helper function moved outside component
const getStatusColor = (status: string) => {
  switch (status) {
    case 'clean': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'error': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

function MetricCard({ 
  title, 
  value, 
  change, 
  unit = '', 
  trend = 'positive' 
}: { 
  title: string; 
  value: number; 
  change: number; 
  unit?: string;
  trend?: 'positive' | 'negative';
}) {
  const isPositive = trend === 'positive' ? change > 0 : change < 0;
  
  return (
    <Card className="p-4">
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-2xl font-bold mb-2">
        {value.toLocaleString()}{unit}
      </div>
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {Math.abs(change)} this week
      </div>
    </Card>
  );
}

function ComponentHealthTable({ 
  components, 
  searchQuery, 
  filterStatus,
  onSelectComponent 
}: {
  components: ComponentHealth[];
  searchQuery: string;
  filterStatus: string;
  onSelectComponent: (id: string) => void;
}) {
  const filtered = components.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || comp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Component Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coverage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Violations
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filtered.map((component) => (
            <tr key={component.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {component.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(component.status)}`}>
                  {component.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {component.coverage}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {component.violations}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectComponent(component.id)}
                    className="text-vergil-purple hover:text-opacity-80"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {component.violations > 0 && (
                    <button className="text-blue-600 hover:text-blue-800">
                      <Zap className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DirectoryTree({ 
  node, 
  expandedDirs, 
  onToggle, 
  level = 0 
}: {
  node: DirectoryNode;
  expandedDirs: Set<string>;
  onToggle: (path: string) => void;
  level?: number;
}) {
  const isExpanded = expandedDirs.has(node.path);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => hasChildren && onToggle(node.path)}
      >
        {hasChildren && (
          isExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />
        )}
        {!hasChildren && <div className="w-4 mr-1" />}
        <span className="text-sm">{node.name}</span>
        <span className={`ml-2 px-2 text-xs rounded-full ${getStatusColor(node.status)}`}>
          {node.violations} violations
        </span>
      </div>
      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <DirectoryTree 
              key={child.path}
              node={child}
              expandedDirs={expandedDirs}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
          <div className={`p-2 rounded-full ${
            activity.type === 'migration' ? 'bg-green-100' :
            activity.type === 'violation' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            {activity.type === 'migration' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
             activity.type === 'violation' ? <AlertCircle className="w-4 h-4 text-red-600" /> :
             <Zap className="w-4 h-4 text-blue-600" />}
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600">
              {new Date(activity.timestamp).toLocaleTimeString()} 
              {activity.user && <span className="font-medium"> - @{activity.user}</span>}
            </div>
            <div className="text-sm font-medium">{activity.message}</div>
            {activity.details && (
              <div className="text-xs text-gray-500 mt-1">{activity.details}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}