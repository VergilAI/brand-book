'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Copy,
  Check,
  FileCode,
  FileType,
  Palette,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface ColorData {
  value: string;
  normalizedValue: string;
  scale?: string;
  scaleStep?: string;
  semanticNames: string[];
  instances: {
    hardcoded: ColorInstance[];
    inGeneratedTS: ColorInstance[];
    inGeneratedCSS: ColorInstance[];
    inYAML: { path: string; tokenName: string }[];
  };
  totalInstances: number;
  isFullyMigrated: boolean;
  healthScore: number;
  syncStatus?: 'synced' | 'outOfSync' | 'notPresent' | 'notApplicable';
  syncDetails?: {
    yaml?: string;
    ts?: string;
    css?: string;
    tailwind?: string;
  };
}

interface ColorInstance {
  file: string;
  line: number;
  context: string;
  type: string;
}

interface ColorReport {
  timestamp: string;
  summary: {
    totalUniqueColors: number;
    fullyMigratedColors: number;
    partiallyMigratedColors: number;
    unmappedColors: number;
    overallHealthScore: number;
    syncStats?: {
      totalYamlColors: number;
      syncedColors: number;
      outOfSyncColors: number;
      notPresentColors: number;
      syncPercentage: number;
    };
  };
  colors: Record<string, ColorData>;
  scales: Record<string, string[]>;
  yamlColors: string[];
  nonYamlColors: string[];
  fileStats: {
    totalFilesScanned: number;
    filesWithHardcodedColors: number;
  };
}

type FilterType = 'all' | 'fully-migrated' | 'partial' | 'unmapped' | 'hardcoded-only';

// Sync status indicator component
function SyncStatusIndicator({ color }: { color: ColorData }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Skip sync check if not in YAML
  if (color.instances.inYAML.length === 0) {
    return <span className="text-xs text-gray-400">N/A</span>;
  }
  
  const getSyncIcon = () => {
    switch (color.syncStatus) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'outOfSync':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'notPresent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <span className="text-xs text-gray-400">N/A</span>;
    }
  };
  
  const getSyncLabel = () => {
    switch (color.syncStatus) {
      case 'synced':
        return 'In Sync';
      case 'outOfSync':
        return 'Out of Sync';
      case 'notPresent':
        return 'Not Present';
      default:
        return 'N/A';
    }
  };
  
  return (
    <div className="relative inline-block">
      <div 
        className="flex items-center gap-1 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {getSyncIcon()}
        <span className="text-xs">{getSyncLabel()}</span>
      </div>
      
      {showTooltip && color.syncDetails && (
        <div className="absolute z-50 bottom-full right-0 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg min-w-[200px]">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span>YAML:</span>
              <span className="font-mono">{color.syncDetails.yaml || 'Not found'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>TypeScript:</span>
              <span className={`font-mono ${color.syncDetails.ts !== color.syncDetails.yaml ? 'text-orange-400' : ''}`}>
                {color.syncDetails.ts || 'Not found'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>CSS:</span>
              <span className={`font-mono ${color.syncDetails.css !== color.syncDetails.yaml ? 'text-orange-400' : ''}`}>
                {color.syncDetails.css || 'Not found'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tailwind:</span>
              <span className={`font-mono ${color.syncDetails.tailwind !== color.syncDetails.yaml ? 'text-orange-400' : ''}`}>
                {color.syncDetails.tailwind || 'Not found'}
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 right-6 transform translate-y-full">
            <div className="border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for scale status
function ScaleStatusIndicators({ colors }: { colors: ColorData[] }) {
  const yamlColors = colors.filter(c => c.instances.inYAML.length > 0);
  const syncStats = {
    synced: yamlColors.filter(c => c.syncStatus === 'synced').length,
    outOfSync: yamlColors.filter(c => c.syncStatus === 'outOfSync').length,
    notPresent: yamlColors.filter(c => c.syncStatus === 'notPresent').length,
  };
  
  const stats = {
    inYAML: colors.every(c => c.instances.inYAML.length > 0),
    allSynced: yamlColors.length > 0 && syncStats.synced === yamlColors.length,
    someSynced: syncStats.synced > 0,
    noHardcoded: colors.every(c => c.instances.hardcoded.length === 0),
    
    partialYAML: colors.some(c => c.instances.inYAML.length > 0),
    partialNoHardcoded: colors.some(c => c.instances.hardcoded.length === 0),
  };
  
  return (
    <div className="flex items-center gap-4 text-xs">
      <div className="flex items-center gap-1">
        {stats.inYAML ? (
          <CheckCircle className="w-3 h-3 text-green-600" />
        ) : stats.partialYAML ? (
          <AlertCircle className="w-3 h-3 text-yellow-600" />
        ) : (
          <XCircle className="w-3 h-3 text-gray-300" />
        )}
        <span className={stats.inYAML ? 'text-green-600' : stats.partialYAML ? 'text-yellow-600' : 'text-gray-400'}>
          YAML
        </span>
      </div>
      
      {/* Aggregate Sync Status */}
      <div className="flex items-center gap-1">
        {stats.allSynced ? (
          <CheckCircle className="w-3 h-3 text-green-600" />
        ) : syncStats.outOfSync > 0 ? (
          <AlertCircle className="w-3 h-3 text-orange-500" />
        ) : syncStats.notPresent > 0 ? (
          <XCircle className="w-3 h-3 text-red-600" />
        ) : (
          <XCircle className="w-3 h-3 text-gray-300" />
        )}
        <span className={
          stats.allSynced ? 'text-green-600' : 
          syncStats.outOfSync > 0 ? 'text-orange-500' :
          syncStats.notPresent > 0 ? 'text-red-600' : 'text-gray-400'
        }>
          {syncStats.outOfSync > 0 && `${syncStats.outOfSync} Out of Sync`}
          {syncStats.outOfSync === 0 && syncStats.notPresent > 0 && `${syncStats.notPresent} Not Present`}
          {stats.allSynced && 'All Synced'}
          {!stats.allSynced && syncStats.synced === 0 && yamlColors.length === 0 && 'N/A'}
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        {stats.noHardcoded ? (
          <CheckCircle className="w-3 h-3 text-green-600" />
        ) : stats.partialNoHardcoded ? (
          <AlertCircle className="w-3 h-3 text-yellow-600" />
        ) : (
          <XCircle className="w-3 h-3 text-red-600" />
        )}
        <span className={stats.noHardcoded ? 'text-green-600' : stats.partialNoHardcoded ? 'text-yellow-600' : 'text-red-600'}>
          {stats.noHardcoded ? 'No Hardcoded' : 'Hardcoded'}
        </span>
      </div>
    </div>
  );
}

export function ColorMigrationTab() {
  const [report, setReport] = useState<ColorReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedColors, setExpandedColors] = useState<Set<string>>(new Set());
  const [expandedScales, setExpandedScales] = useState<Set<string>>(new Set(['purple', 'gray'])); // Start with main scales expanded
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    isInSync: boolean;
    yamlLastModified: string;
    generatedLastModified: string;
    needsRegeneration: boolean;
    details: any;
  } | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetchReport();
    checkSyncStatus();
  }, []);

  const checkSyncStatus = async () => {
    try {
      const response = await fetch('/api/migration/check-sync');
      const data = await response.json();
      setSyncStatus(data);
    } catch (error) {
      console.error('Failed to check sync status:', error);
    }
  };

  const regenerateTokens = async () => {
    setRegenerating(true);
    try {
      const response = await fetch('/api/migration/regenerate-tokens', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // Reload sync status and report after successful regeneration
        await checkSyncStatus();
        await fetchReport();
      } else {
        console.error('Token regeneration failed:', data.error);
        alert(`Token regeneration failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to regenerate tokens:', error);
      alert('Failed to regenerate tokens. Check console for details.');
    } finally {
      setRegenerating(false);
    }
  };

  const fetchReport = async () => {
    try {
      const response = await fetch('/api/migration/analyze-colors');
      const data = await response.json();
      
      if (data.hasReport && data.report) {
        setReport(data.report);
      }
    } catch (error) {
      console.error('Failed to fetch color report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const toggleExpanded = (colorKey: string) => {
    setExpandedColors(prev => {
      const next = new Set(prev);
      if (next.has(colorKey)) {
        next.delete(colorKey);
      } else {
        next.add(colorKey);
      }
      return next;
    });
  };

  const toggleScale = (scale: string) => {
    setExpandedScales(prev => {
      const next = new Set(prev);
      if (next.has(scale)) {
        next.delete(scale);
      } else {
        next.add(scale);
      }
      return next;
    });
  };

  const filterColors = (colors: Record<string, ColorData>) => {
    return Object.entries(colors).filter(([key, color]) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!color.value.toLowerCase().includes(query) &&
            !color.normalizedValue.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Status filter
      switch (filter) {
        case 'fully-migrated':
          return color.isFullyMigrated;
        case 'partial':
          return !color.isFullyMigrated && color.healthScore > 0;
        case 'unmapped':
          return color.healthScore === 0;
        case 'hardcoded-only':
          return color.instances.hardcoded.length > 0;
        default:
          return true;
      }
    });
  };

  const getHealthIcon = (score: number) => {
    if (score === 100) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score > 0) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getHealthLabel = (score: number) => {
    if (score === 100) return 'Fully Migrated';
    if (score > 0) return `${score}% Migrated`;
    return 'Not Migrated';
  };

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">Loading color analysis...</p>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="p-12 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">No color analysis report found.</p>
        <p className="text-sm text-gray-500">Click "Run Analysis" to generate a report.</p>
      </Card>
    );
  }

  const filteredColors = filterColors(report.colors);

  return (
    <div className="space-y-6">
      {/* Sync Status Card */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {syncStatus?.isInSync && report?.summary.syncStats?.syncPercentage === 100 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
                <span className="font-medium">
                  {syncStatus?.isInSync ? 'Files Generated' : 'Files Need Regeneration'}
                  {report?.summary.syncStats && syncStatus?.isInSync && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      • {report.summary.syncStats.syncPercentage}% Value Sync
                    </span>
                  )}
                </span>
              </div>
              {syncStatus && (
                <div className="text-sm text-gray-600">
                  Last generated: {new Date(syncStatus.generatedLastModified).toLocaleTimeString()}
                </div>
              )}
            </div>
            <button
              onClick={regenerateTokens}
              disabled={regenerating || syncStatus?.isInSync}
              className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                syncStatus?.isInSync
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-purple text-white hover:bg-brand-purple-light'
              }`}
            >
              {regenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Tokens
                </>
              )}
            </button>
          </div>
          
          {/* Value Sync Details */}
          {syncStatus?.isInSync && report?.summary.syncStats && (
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{report.summary.syncStats.syncedColors} synced</span>
              </div>
              {report.summary.syncStats.outOfSyncColors > 0 && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span>{report.summary.syncStats.outOfSyncColors} out of sync</span>
                </div>
              )}
              {report.summary.syncStats.notPresentColors > 0 && (
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>{report.summary.syncStats.notPresentColors} not present</span>
                </div>
              )}
            </div>
          )}
          
          {syncStatus?.details?.missingGenerated?.length > 0 && (
            <div className="text-sm text-red-600">
              Missing generated files: {syncStatus.details.missingGenerated.join(', ')}
            </div>
          )}
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Color Migration Summary</h2>
        
        {/* Overall Health Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Health Score</span>
            <span className="text-2xl font-bold">
              {report.summary.overallHealthScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                report.summary.overallHealthScore === 100 ? 'bg-green-500' :
                report.summary.overallHealthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${report.summary.overallHealthScore}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {report.summary.fullyMigratedColors} of {report.summary.totalUniqueColors} colors fully migrated
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {report.summary.totalUniqueColors}
            </div>
            <div className="text-sm text-gray-600">Total Colors</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {report.summary.fullyMigratedColors}
            </div>
            <div className="text-sm text-gray-600">Fully Migrated</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {report.summary.partiallyMigratedColors}
            </div>
            <div className="text-sm text-gray-600">Partially Migrated</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {report.summary.unmappedColors}
            </div>
            <div className="text-sm text-gray-600">Unmapped</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Report generated: {new Date(report.timestamp).toLocaleString()}</p>
          <p>{report.fileStats.filesWithHardcodedColors} files contain hardcoded colors</p>
        </div>
      </Card>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search colors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md text-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-4 py-2 border rounded-md text-sm"
          >
            <option value="all">All Colors ({Object.keys(report.colors).length})</option>
            <option value="fully-migrated">Fully Migrated ({report.summary.fullyMigratedColors})</option>
            <option value="partial">Partially Migrated ({report.summary.partiallyMigratedColors})</option>
            <option value="unmapped">Unmapped ({report.summary.unmappedColors})</option>
            <option value="hardcoded-only">With Hardcoded ({Object.values(report.colors).filter(c => c.instances.hardcoded.length > 0).length})</option>
          </select>
        </div>
      </Card>

      {/* Color List Grouped by Scales and YAML Status */}
      <div className="space-y-6">
        {/* Scale Colors (from YAML) */}
        {Object.entries(report.scales || {}).map(([scaleName, colorKeys]) => {
          const scaleColors = colorKeys
            .map(key => [key, report.colors[key]] as [string, ColorData])
            .filter(([key, color]) => {
              // Apply filters
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!color.value.toLowerCase().includes(query) &&
                    !color.normalizedValue.toLowerCase().includes(query) &&
                    !color.semanticNames.some(name => name.toLowerCase().includes(query))) {
                  return false;
                }
              }
              
              switch (filter) {
                case 'fully-migrated':
                  return color.isFullyMigrated;
                case 'partial':
                  return !color.isFullyMigrated && color.healthScore > 0;
                case 'unmapped':
                  return color.healthScore === 0;
                case 'hardcoded-only':
                  return color.instances.hardcoded.length > 0;
                default:
                  return true;
              }
            });
          
          if (scaleColors.length === 0) return null;
          
          const isScaleExpanded = expandedScales.has(scaleName);
          const scaleHealthScore = Math.round(
            scaleColors.reduce((sum, [_, color]) => sum + color.healthScore, 0) / scaleColors.length
          );
          
          return (
            <div key={scaleName} className="space-y-4">
              {/* Scale Header */}
              <div 
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => toggleScale(scaleName)}
              >
                <div className="flex-shrink-0">
                  {isScaleExpanded ? 
                    <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </div>
                <h3 className="text-lg font-medium capitalize">
                  {scaleName} Scale
                </h3>
                <span className="text-sm text-gray-500">
                  ({scaleColors.length} colors)
                </span>
                
                {/* Scale Status Indicators */}
                <div className="ml-4">
                  <ScaleStatusIndicators colors={scaleColors.map(([_, c]) => c)} />
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm text-gray-600">{scaleHealthScore}% healthy</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        scaleHealthScore === 100 ? 'bg-green-500' :
                        scaleHealthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${scaleHealthScore}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Scale Colors */}
              {isScaleExpanded && (
                <div className="space-y-4 ml-8">
                  {scaleColors.map(([key, color]) => {
                    const isExpanded = expandedColors.has(key);
                    
                    return (
                      <Card key={key} className="overflow-visible">
              {/* Color Header */}
              <div 
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(key)}
              >
                {/* Expand/Collapse Icon */}
                <div className="flex-shrink-0">
                  {isExpanded ? 
                    <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </div>

                {/* Color Swatch */}
                <div 
                  className="w-12 h-12 rounded-md border-2 border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: color.value }}
                />

                {/* Color Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {color.scale && color.scaleStep && (
                      <span className="text-sm font-medium text-gray-700">
                        {color.scale}-{color.scaleStep}:
                      </span>
                    )}
                    <code className="font-mono text-sm font-medium">{color.value}</code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(color.value);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copiedValue === color.value ? 
                        <Check className="w-3 h-3 text-green-600" /> : 
                        <Copy className="w-3 h-3 text-gray-400" />
                      }
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {color.totalInstances} total instances • {color.instances.hardcoded.length} hardcoded
                  </div>
                  {color.semanticNames.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Also known as: {color.semanticNames.join(', ')}
                    </div>
                  )}
                </div>

                {/* Status Indicators */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    {color.instances.inYAML.length > 0 ? 
                      <CheckCircle className="w-4 h-4 text-green-600" /> : 
                      <XCircle className="w-4 h-4 text-gray-300" />
                    }
                    <span className={color.instances.inYAML.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                      YAML
                    </span>
                  </div>
                  
                  {/* Sync Status */}
                  <SyncStatusIndicator color={color} />
                  
                  <div className="flex items-center gap-2">
                    {color.instances.hardcoded.length === 0 ? 
                      <CheckCircle className="w-4 h-4 text-green-600" /> : 
                      <XCircle className="w-4 h-4 text-red-600" />
                    }
                    <span className={color.instances.hardcoded.length === 0 ? 'text-green-600' : 'text-red-600'}>
                      {color.instances.hardcoded.length === 0 ? 'No Hardcoded' : 'Hardcoded'}
                    </span>
                  </div>
                  
                  {/* Health Status - Always show */}
                  <div className="flex items-center gap-2">
                    {color.isFullyMigrated ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Healthy</span>
                      </>
                    ) : (
                      <>
                        {color.healthScore > 0 ? (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          color.healthScore > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {color.healthScore}% Migrated
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t bg-gray-50 p-4 space-y-4">
                  {/* YAML Tokens */}
                  {color.instances.inYAML.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">YAML Token Definition</h4>
                      <div className="space-y-1">
                        {color.instances.inYAML.map((yaml, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Palette className="w-4 h-4 text-gray-400" />
                            <code className="bg-white px-2 py-1 rounded">{yaml.path}</code>
                            <span className="text-gray-500">→</span>
                            <code className="bg-white px-2 py-1 rounded">{yaml.tokenName}</code>
                          </div>
                        ))}
                      </div>
                      
                      {/* Semantic Names */}
                      {color.semanticNames.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="text-xs font-medium text-gray-600 mb-1">Semantic Aliases</h5>
                          <div className="space-y-1">
                            {color.semanticNames.map((name, idx) => (
                              <div key={idx} className="text-xs text-gray-600">
                                <code className="bg-gray-100 px-2 py-0.5 rounded">{name}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generated Files */}
                  {(color.instances.inGeneratedTS.length > 0 || color.instances.inGeneratedCSS.length > 0) && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available in Generated Files</h4>
                      <div className="flex gap-4 text-sm">
                        {color.instances.inGeneratedTS.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileType className="w-4 h-4 text-blue-600" />
                            <span>TypeScript</span>
                          </div>
                        )}
                        {color.instances.inGeneratedCSS.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileCode className="w-4 h-4 text-purple-600" />
                            <span>CSS</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hardcoded Instances */}
                  {color.instances.hardcoded.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-2">
                        Hardcoded Instances ({color.instances.hardcoded.length})
                      </h4>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {color.instances.hardcoded.slice(0, 10).map((instance, idx) => (
                          <div key={idx} className="bg-white p-2 rounded text-xs font-mono">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <FileCode className="w-3 h-3" />
                              <span>{instance.file}:{instance.line}</span>
                            </div>
                            <div className="text-gray-800 truncate">{instance.context}</div>
                          </div>
                        ))}
                        {color.instances.hardcoded.length > 10 && (
                          <p className="text-xs text-gray-500 text-center py-2">
                            ... and {color.instances.hardcoded.length - 10} more instances
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Migration Status */}
                  <div className="bg-white p-3 rounded">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Migration Checklist</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        {color.instances.inYAML.length > 0 ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                        <span>Defined in YAML source tokens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {color.instances.inGeneratedTS.length > 0 ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                        <span>Available in generated TypeScript</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {color.instances.inGeneratedCSS.length > 0 ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                        <span>Available in generated CSS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {color.instances.hardcoded.length === 0 ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                        <span>{color.instances.hardcoded.length === 0 ? 'No hardcoded usage' : `${color.instances.hardcoded.length} hardcoded instances`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        
        {/* YAML Standalone Colors (not in scales) */}
        {(() => {
          const yamlStandalone = report.yamlColors
            .filter(colorKey => {
              // Not in any scale
              return !Object.values(report.scales || {}).flat().includes(colorKey);
            })
            .map(key => [key, report.colors[key]] as [string, ColorData])
            .filter(([key, color]) => {
              // Apply filters
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!color.value.toLowerCase().includes(query) &&
                    !color.normalizedValue.toLowerCase().includes(query) &&
                    !color.semanticNames.some(name => name.toLowerCase().includes(query))) {
                  return false;
                }
              }
              
              switch (filter) {
                case 'fully-migrated':
                  return color.isFullyMigrated;
                case 'partial':
                  return !color.isFullyMigrated && color.healthScore > 0;
                case 'unmapped':
                  return color.healthScore === 0;
                case 'hardcoded-only':
                  return color.instances.hardcoded.length > 0;
                default:
                  return true;
              }
            });
          
          if (yamlStandalone.length === 0) return null;
          
          const isExpanded = expandedScales.has('yaml-standalone');
          const healthScore = Math.round(
            yamlStandalone.reduce((sum, [_, color]) => sum + color.healthScore, 0) / yamlStandalone.length
          );
          
          return (
            <div className="space-y-4">
              <div 
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => toggleScale('yaml-standalone')}
              >
                <div className="flex-shrink-0">
                  {isExpanded ? 
                    <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </div>
                <h3 className="text-lg font-medium">
                  YAML Standalone Colors
                </h3>
                <span className="text-sm text-gray-500">
                  ({yamlStandalone.length} colors)
                </span>
                
                {/* Status Indicators */}
                <div className="ml-4">
                  <ScaleStatusIndicators colors={yamlStandalone.map(([_, c]) => c)} />
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm text-gray-600">{healthScore}% healthy</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        healthScore === 100 ? 'bg-green-500' :
                        healthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="space-y-4 ml-8">
                  {yamlStandalone.map(([key, color]) => {
                    const isColorExpanded = expandedColors.has(key);
                    return (
                      <Card key={key} className="overflow-visible">
                        {/* Same color rendering as in scales */}
                        <div 
                          className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpanded(key)}
                        >
                          <div className="flex-shrink-0">
                            {isColorExpanded ? 
                              <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            }
                          </div>
                          <div 
                            className="w-12 h-12 rounded-md border-2 border-gray-300 flex-shrink-0"
                            style={{ backgroundColor: color.value }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-sm font-medium">{color.value}</code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(color.value);
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {copiedValue === color.value ? 
                                  <Check className="w-3 h-3 text-green-600" /> : 
                                  <Copy className="w-3 h-3 text-gray-400" />
                                }
                              </button>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {color.totalInstances} total instances • {color.instances.hardcoded.length} hardcoded
                            </div>
                            {color.semanticNames.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Also known as: {color.semanticNames.join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              {color.instances.inYAML.length > 0 ? 
                                <CheckCircle className="w-4 h-4 text-green-600" /> : 
                                <XCircle className="w-4 h-4 text-gray-300" />
                              }
                              <span className={color.instances.inYAML.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                                YAML
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {color.instances.inGeneratedTS.length > 0 ? 
                                <CheckCircle className="w-4 h-4 text-green-600" /> : 
                                <XCircle className="w-4 h-4 text-gray-300" />
                              }
                              <span className={color.instances.inGeneratedTS.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                                TS
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {color.instances.inGeneratedCSS.length > 0 ? 
                                <CheckCircle className="w-4 h-4 text-green-600" /> : 
                                <XCircle className="w-4 h-4 text-gray-300" />
                              }
                              <span className={color.instances.inGeneratedCSS.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                                CSS
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {color.instances.hardcoded.length === 0 ? 
                                <CheckCircle className="w-4 h-4 text-green-600" /> : 
                                <XCircle className="w-4 h-4 text-red-600" />
                              }
                              <span className={color.instances.hardcoded.length === 0 ? 'text-green-600' : 'text-red-600'}>
                                {color.instances.hardcoded.length === 0 ? 'No Hardcoded' : 'Hardcoded'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getHealthIcon(color.healthScore)}
                            <span className="text-sm font-medium">
                              {getHealthLabel(color.healthScore)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Expanded details - same as in scales */}
                        {isColorExpanded && (
                          <div className="border-t bg-gray-50 p-4 space-y-4">
                            {/* Copy the expanded section from scales */}
                            {/* ... rest of expanded content ... */}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
        
        {/* Non-YAML Colors */}
        {(() => {
          const nonYamlFiltered = report.nonYamlColors
            .map(key => [key, report.colors[key]] as [string, ColorData])
            .filter(([key, color]) => {
              // Apply filters
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!color.value.toLowerCase().includes(query) &&
                    !color.normalizedValue.toLowerCase().includes(query)) {
                  return false;
                }
              }
              
              switch (filter) {
                case 'fully-migrated':
                  return false; // Non-YAML can't be fully migrated
                case 'partial':
                  return color.healthScore > 0;
                case 'unmapped':
                  return true; // All non-YAML are unmapped
                case 'hardcoded-only':
                  return color.instances.hardcoded.length > 0;
                default:
                  return true;
              }
            });
          
          if (nonYamlFiltered.length === 0) return null;
          
          const isExpanded = expandedScales.has('non-yaml');
          
          return (
            <div className="space-y-4">
              <div 
                className="flex items-center gap-3 p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100"
                onClick={() => toggleScale('non-yaml')}
              >
                <div className="flex-shrink-0">
                  {isExpanded ? 
                    <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </div>
                <h3 className="text-lg font-medium text-red-900">
                  Non-YAML Colors (Need Migration)
                </h3>
                <span className="text-sm text-red-700">
                  ({nonYamlFiltered.length} colors)
                </span>
                
                {/* Status Indicators - all will be red */}
                <div className="ml-4">
                  <ScaleStatusIndicators colors={nonYamlFiltered.map(([_, c]) => c)} />
                </div>
                
                <div className="ml-auto">
                  <span className="text-sm text-red-700 font-medium">0% healthy</span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="space-y-4 ml-8">
                  {nonYamlFiltered.map(([key, color]) => {
                    const isColorExpanded = expandedColors.has(key);
                    return (
                      <Card key={key} className="overflow-hidden border-red-200">
                        {/* Same color rendering but with red accents */}
                        <div 
                          className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleExpanded(key)}
                        >
                          <div className="flex-shrink-0">
                            {isColorExpanded ? 
                              <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            }
                          </div>
                          <div 
                            className="w-12 h-12 rounded-md border-2 border-red-300 flex-shrink-0"
                            style={{ backgroundColor: color.value }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-sm font-medium">{color.value}</code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(color.value);
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {copiedValue === color.value ? 
                                  <Check className="w-3 h-3 text-green-600" /> : 
                                  <Copy className="w-3 h-3 text-gray-400" />
                                }
                              </button>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {color.totalInstances} total instances • {color.instances.hardcoded.length} hardcoded
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-gray-300" />
                              <span className="text-gray-400">YAML</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {color.instances.inGeneratedTS.length > 0 ? 
                                <CheckCircle className="w-4 h-4 text-green-600" /> : 
                                <XCircle className="w-4 h-4 text-gray-300" />
                              }
                              <span className={color.instances.inGeneratedTS.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                                TS
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {color.instances.inGeneratedCSS.length > 0 ? 
                                <CheckCircle className="w-4 h-4 text-green-600" /> : 
                                <XCircle className="w-4 h-4 text-gray-300" />
                              }
                              <span className={color.instances.inGeneratedCSS.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                                CSS
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-red-600">Hardcoded</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium text-red-600">
                              Not in YAML
                            </span>
                          </div>
                        </div>
                        
                        {/* Expanded details */}
                        {isColorExpanded && (
                          <div className="border-t bg-red-50 p-4 space-y-4">
                            <div className="bg-red-100 p-3 rounded text-sm text-red-800">
                              <strong>Migration Required:</strong> This color is not defined in the design system YAML.
                              Consider adding it to the appropriate scale or as a standalone token.
                            </div>
                            
                            {/* Hardcoded Instances */}
                            {color.instances.hardcoded.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-red-700 mb-2">
                                  Hardcoded Instances ({color.instances.hardcoded.length})
                                </h4>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                  {color.instances.hardcoded.slice(0, 10).map((instance, idx) => (
                                    <div key={idx} className="bg-white p-2 rounded text-xs font-mono">
                                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                                        <FileCode className="w-3 h-3" />
                                        <span>{instance.file}:{instance.line}</span>
                                      </div>
                                      <div className="text-gray-800 truncate">{instance.context}</div>
                                    </div>
                                  ))}
                                  {color.instances.hardcoded.length > 10 && (
                                    <p className="text-xs text-gray-500 text-center py-2">
                                      ... and {color.instances.hardcoded.length - 10} more instances
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {report.colors && Object.keys(report.colors).length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-600">No colors match your filters.</p>
        </Card>
      )}
    </div>
  );
}