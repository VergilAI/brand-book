import { useState, useEffect } from 'react';
import { X, Zap, Eye, Code, Check, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { tokens } from '@/generated/tokens';

interface ComponentDetailModalProps {
  componentId: string;
  onClose: () => void;
}

interface ViolationDetail {
  type: string;
  value: string;
  line: number;
  column: number;
  context: string;
  suggestedToken: string;
  confidence: number;
}

export function ComponentDetailModal({ componentId, onClose }: ComponentDetailModalProps) {
  const [violations, setViolations] = useState<ViolationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedViolations, setSelectedViolations] = useState<Set<number>>(new Set());
  const [previewMode, setPreviewMode] = useState(false);
  const [diff, setDiff] = useState<any[]>([]);

  useEffect(() => {
    fetchViolations();
  }, [componentId]);

  const fetchViolations = async () => {
    try {
      const response = await fetch(`/api/migration/violations/${componentId}`);
      const data = await response.json();
      setViolations(data.violations);
    } catch (error) {
      console.error('Failed to fetch violations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedViolations.size === violations.length) {
      setSelectedViolations(new Set());
    } else {
      setSelectedViolations(new Set(violations.map((_, i) => i)));
    }
  };

  const handlePreview = async () => {
    const selected = violations.filter((_, i) => selectedViolations.has(i));
    
    try {
      const response = await fetch('/api/migration/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId,
          violations: selected,
          dryRun: true
        })
      });
      
      const data = await response.json();
      setDiff(data.diff);
      setPreviewMode(true);
    } catch (error) {
      console.error('Failed to preview fixes:', error);
    }
  };

  const handleApplyFixes = async () => {
    const selected = violations.filter((_, i) => selectedViolations.has(i));
    
    try {
      const response = await fetch('/api/migration/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId,
          violations: selected,
          dryRun: false
        })
      });
      
      const data = await response.json();
      if (data.fixesApplied > 0) {
        // Refresh violations
        await fetchViolations();
        setPreviewMode(false);
        setSelectedViolations(new Set());
      }
    } catch (error) {
      console.error('Failed to apply fixes:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'color': return 'bg-purple-100 text-purple-800';
      case 'spacing': return 'bg-blue-100 text-blue-800';
      case 'arbitrary-tailwind': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{componentId} - Violations</h2>
            <p className="text-sm text-gray-600 mt-1">
              {violations.length} violations found
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading violations...</p>
            </div>
          ) : previewMode ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Preview Changes</h3>
              <div className="space-y-2">
                {diff.map((change, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="text-sm text-gray-600 mb-1">Line {change.line}</div>
                    {change.removed && (
                      <div className="bg-red-50 text-red-800 p-2 rounded text-sm font-mono mb-1">
                        - {change.removed}
                      </div>
                    )}
                    {change.added && (
                      <div className="bg-green-50 text-green-800 p-2 rounded text-sm font-mono">
                        + {change.added}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {violations.map((violation, index) => (
                <div
                  key={index}
                  className={`border rounded-md p-4 ${
                    selectedViolations.has(index) ? 'border-vergil-purple bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedViolations.has(index)}
                      onChange={(e) => {
                        const next = new Set(selectedViolations);
                        if (e.target.checked) {
                          next.add(index);
                        } else {
                          next.delete(index);
                        }
                        setSelectedViolations(next);
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(violation.type)}`}>
                          {violation.type}
                        </span>
                        <span className="text-sm font-medium">{violation.value}</span>
                        <span className="text-sm text-gray-500">Line {violation.line}</span>
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-sm font-mono mb-2">
                        {violation.context}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span>Suggested: <code className="bg-gray-200 px-1 rounded">{violation.suggestedToken}</code></span>
                        </div>
                        <div className="text-gray-600">
                          Confidence: {violation.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedViolations.size === violations.length && violations.length > 0}
              onChange={handleSelectAll}
              className="mr-1"
            />
            <span className="text-sm text-gray-600">
              Select all ({selectedViolations.size} selected)
            </span>
          </div>
          <div className="flex gap-2">
            {previewMode ? (
              <>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleApplyFixes}
                  className="px-4 py-2 bg-vergil-purple text-white rounded-md hover:bg-opacity-90 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Apply Fixes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handlePreview}
                  disabled={selectedViolations.size === 0}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  disabled={selectedViolations.size === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Auto Fix
                </button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}