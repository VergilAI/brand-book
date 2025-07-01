import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress?: number;
}

interface MigrationProgressProps {
  componentId: string;
  steps: MigrationStep[];
}

export function MigrationProgress({ componentId, steps }: MigrationProgressProps) {
  const currentStepIndex = steps.findIndex(step => step.status === 'in-progress');
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalProgress = Math.round((completedSteps / steps.length) * 100);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Migration Progress: {componentId}</h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-vergil-purple h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <span className="text-sm font-medium">{totalProgress}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-3">
            <div className="flex-shrink-0 pt-0.5">
              {step.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : step.status === 'in-progress' ? (
                <div className="relative">
                  <Circle className="w-5 h-5 text-vergil-purple animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-vergil-purple rounded-full" />
                  </div>
                </div>
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={`font-medium ${
                  step.status === 'completed' ? 'text-gray-900' :
                  step.status === 'in-progress' ? 'text-vergil-purple' :
                  'text-gray-500'
                }`}>
                  Step {index + 1}: {step.title}
                </h4>
                {step.status === 'in-progress' && step.progress !== undefined && (
                  <span className="text-sm text-gray-600">
                    ({step.progress}%)
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              
              {step.status === 'in-progress' && (
                <div className="mt-2 space-y-2">
                  <div className="bg-gray-100 rounded p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span>Analyzing violations...</span>
                    </div>
                  </div>
                  {step.progress !== undefined && (
                    <div className="bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-vergil-purple h-1 rounded-full transition-all"
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
          Pause
        </button>
        <button className="px-4 py-2 bg-vergil-purple text-white rounded-md hover:bg-opacity-90">
          Continue
        </button>
      </div>
    </Card>
  );
}