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
  Download
} from 'lucide-react';

interface ColorData {
  value: string;
  normalizedValue: string;
  instances: {
    hardcoded: ColorInstance[];
    inGeneratedTS: ColorInstance[];
    inGeneratedCSS: ColorInstance[];
    inYAML: { path: string; tokenName: string }[];
  };
  totalInstances: number;
  isFullyMigrated: boolean;
  healthScore: number;
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
  };
  colors: Record<string, ColorData>;
  fileStats: {
    totalFilesScanned: number;
    filesWithHardcodedColors: number;
  };
}

type FilterType = 'all' | 'fully-migrated' | 'partial' | 'unmapped' | 'hardcoded-only';

export function ColorMigrationTab() {
  const [report, setReport] = useState<ColorReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedColors, setExpandedColors] = useState<Set<string>>(new Set());
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, []);

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

      {/* Color List */}
      <div className="space-y-4">
        {filteredColors.map(([key, color]) => {
          const isExpanded = expandedColors.has(key);
          
          return (
            <Card key={key} className="overflow-hidden">
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

                {/* Health Status */}
                <div className="flex items-center gap-2">
                  {getHealthIcon(color.healthScore)}
                  <span className="text-sm font-medium">
                    {getHealthLabel(color.healthScore)}
                  </span>
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

      {filteredColors.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-600">No colors match your filters.</p>
        </Card>
      )}
    </div>
  );
}