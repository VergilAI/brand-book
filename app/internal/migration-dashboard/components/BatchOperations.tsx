import { useState } from 'react';
import { Card } from '@/components/ui/card';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { tokens } from '@/generated/tokens';
import { 
  Zap, 
  FileText, 
  GitBranch, 
  Package,
  AlertTriangle,
  Settings,
  PlayCircle
} from 'lucide-react';

interface BatchOperationsProps {
  selectedComponents: Set<string>;
  totalViolations: number;
  onOperation: (operation: string) => void;
}

export function BatchOperations({ 
  selectedComponents, 
  totalViolations,
  onOperation 
}: BatchOperationsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presets = [
    {
      id: 'quick-win',
      name: 'Quick Win',
      description: 'Fix obvious matches with 100% confidence',
      icon: Zap,
      color: 'bg-green-100 text-green-800' // eslint-disable-line @vergil/tokens/no-hardcoded-colors
    },
    {
      id: 'safe-changes',
      name: 'Safe Changes',
      description: 'Apply changes with >90% confidence',
      icon: Settings,
      color: 'bg-blue-100 text-blue-800' // eslint-disable-line @vergil/tokens/no-hardcoded-colors
    },
    {
      id: 'full-migration',
      name: 'Full Migration',
      description: 'Migrate all possible violations',
      icon: Package,
      color: 'bg-purple-100 text-purple-800' // eslint-disable-line @vergil/tokens/no-hardcoded-colors
    }
  ];

  const operations = [
    {
      id: 'auto-fix-colors',
      name: 'Auto-fix Colors',
      description: 'Replace all matching colors with tokens',
      icon: Zap,
      action: () => onOperation('fix-colors')
    },
    {
      id: 'auto-fix-spacing',
      name: 'Auto-fix Spacing',
      description: 'Convert px values to spacing tokens',
      icon: Settings,
      action: () => onOperation('fix-spacing')
    },
    {
      id: 'generate-report',
      name: 'Generate Report',
      description: 'Export detailed analysis',
      icon: FileText,
      action: () => onOperation('generate-report')
    },
    {
      id: 'add-todo',
      name: 'Add TODO Comments',
      description: 'Mark violations for manual review',
      icon: AlertTriangle,
      action: () => onOperation('add-todos')
    },
    {
      id: 'create-pr',
      name: 'Create PR',
      description: 'Create pull request with fixes',
      icon: GitBranch,
      action: () => onOperation('create-pr')
    }
  ];

  if (selectedComponents.size === 0) {
    return (
      <Card className="p-6 mb-6">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Select components to enable batch operations</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Batch Operations</h3>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <PlayCircle className="w-5 h-5 text-vergil-purple" />
          <span className="font-medium">
            Selected: {selectedComponents.size} components ({totalViolations} violations)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {operations.map((op) => (
            <button
              key={op.id}
              onClick={op.action}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <op.icon className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{op.name}</div>
                <div className="text-xs text-gray-600">{op.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Presets</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id);
                  onOperation(`preset-${preset.id}`);
                }}
                className={`p-3 border rounded-lg hover:bg-gray-50 text-left transition-all ${
                  selectedPreset === preset.id ? 'border-vergil-purple bg-purple-50' : ''
                }`}
              >
                <div className={`inline-flex p-2 rounded-md mb-2 ${preset.color}`}>
                  <preset.icon className="w-4 h-4" />
                </div>
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs text-gray-600 mt-1">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <div className="flex gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Important</p>
            <p className="text-yellow-700 mt-1">
              Always review changes before committing. Automated fixes may need manual adjustments.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}