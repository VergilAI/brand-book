import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Copy, Check, ArrowRight, Palette } from 'lucide-react';
import { tokens } from '@/generated/tokens';

interface ColorData {
  value: string;
  hex: string;
  instances: number;
  files: string[];
  suggestedToken: string;
  confidence: number;
  category: string;
}

export function ColorInventory() {
  const [colors, setColors] = useState<ColorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'mapped' | 'unmapped'>('all');

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/migration/colors');
      const data = await response.json();
      setColors(data.colors);
    } catch (error) {
      console.error('Failed to fetch colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedColor(value);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleReplaceAll = async (color: ColorData) => {
    if (!color.suggestedToken) return;
    
    const confirmed = confirm(
      `Replace all ${color.instances} instances of ${color.value} with ${color.suggestedToken}?`
    );
    
    if (!confirmed) return;

    // In a real implementation, this would call an API to replace all instances
    console.log('Replacing all instances of', color.value, 'with', color.suggestedToken);
  };

  const filteredColors = colors.filter(color => {
    if (filter === 'mapped') return color.suggestedToken;
    if (filter === 'unmapped') return !color.suggestedToken;
    return true;
  });

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Palette className="w-8 h-8 animate-pulse mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Analyzing color usage...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Color Inventory</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'all' ? 'bg-vergil-purple text-white' : 'bg-gray-100'
            }`}
          >
            All ({colors.length})
          </button>
          <button
            onClick={() => setFilter('mapped')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'mapped' ? 'bg-vergil-purple text-white' : 'bg-gray-100'
            }`}
          >
            Mapped ({colors.filter(c => c.suggestedToken).length})
          </button>
          <button
            onClick={() => setFilter('unmapped')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'unmapped' ? 'bg-vergil-purple text-white' : 'bg-gray-100'
            }`}
          >
            Unmapped ({colors.filter(c => !c.suggestedToken).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredColors.map((color, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              {/* Color swatch */}
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-md border shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
              </div>

              {/* Color details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm font-medium">{color.value}</span>
                  <button
                    onClick={() => handleCopy(color.value)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copiedColor === color.value ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <span className="text-sm text-gray-600">
                    ({color.instances} instances)
                  </span>
                </div>

                {/* Token mapping */}
                {color.suggestedToken ? (
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {color.suggestedToken}
                    </code>
                    <span className="text-xs text-gray-600">
                      {color.confidence}% confidence
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-red-600 mb-2">
                    No token mapping found
                  </div>
                )}

                {/* File list */}
                <div className="text-xs text-gray-600">
                  Used in: {color.files.slice(0, 3).join(', ')}
                  {color.files.length > 3 && ` and ${color.files.length - 3} more files`}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                {color.suggestedToken && (
                  <button
                    onClick={() => handleReplaceAll(color)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Replace All
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Source Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-2xl font-bold">{colors.filter(c => c.files.some(f => f.endsWith('.tsx') || f.endsWith('.ts'))).length}</div>
            <div className="text-gray-600">TypeScript files</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{colors.filter(c => c.files.some(f => f.endsWith('.css') || f.endsWith('.scss'))).length}</div>
            <div className="text-gray-600">CSS/SCSS files</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{colors.filter(c => c.suggestedToken?.includes('vergil')).length}</div>
            <div className="text-gray-600">Brand colors</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{colors.filter(c => !c.suggestedToken).length}</div>
            <div className="text-gray-600">Need mapping</div>
          </div>
        </div>
      </div>
    </Card>
  );
}