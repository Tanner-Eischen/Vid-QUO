import React from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  path: string;
}

const steps: Step[] = [
  { id: '1', title: 'Basic Information', path: '/create-quote/basic' },
  { id: '2', title: 'Production Details', path: '/create-quote/production' },
  { id: '3', title: 'Advanced Options', path: '/create-quote/advanced' },
  { id: '4', title: 'Review Quote', path: '/create-quote/review' },
];

export const QuoteFlowSidebar: React.FC = () => {
  const location = useLocation();

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.path === location.pathname);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-6">Create Quote</h2>
      <nav className="space-y-1">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : isCompleted
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <Circle
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-blue-600 fill-blue-600' : ''
                  }`}
                />
              )}
              <div className="flex-1">
                <div className="text-xs font-medium mb-0.5">Step {step.id}</div>
                <div className={`text-sm ${isActive ? 'font-semibold' : ''}`}>
                  {step.title}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
