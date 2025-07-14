import React from 'react';
import { Users, Building2, UserCheck, Award, FileText, Calendar } from 'lucide-react';

interface ThemePreviewProps {
  themeName: string;
  themeClass: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function ThemePreview({ themeName, themeClass, description, isActive, onClick }: ThemePreviewProps) {
  const sampleData = [
    { icon: Users, label: 'Total', value: '248', color: 'blue' },
    { icon: UserCheck, label: 'Active', value: '189', color: 'green' },
    { icon: FileText, label: 'Contract', value: '156', color: 'amber' },
    { icon: Award, label: 'Permanent', value: '33', color: 'purple' },
  ];

  return (
    <div 
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-4 ring-blue-400 scale-105' : 'hover:scale-102'
      }`}
      onClick={onClick}
    >
      {/* Theme Preview Container */}
      <div className={`${themeClass} p-4 min-h-[200px]`}>
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-bold text-lg theme-text-primary">{themeName}</h3>
          <p className="text-sm theme-text-secondary">{description}</p>
        </div>
        
        {/* Sample Dashboard Cards */}
        <div className="grid grid-cols-2 gap-2">
          {sampleData.map((item, index) => (
            <div key={index} className="theme-card rounded-lg p-3 border theme-border">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded theme-bg-primary">
                  <item.icon className="w-4 h-4 theme-accent" />
                </div>
                <div>
                  <div className="text-xs theme-text-secondary">{item.label}</div>
                  <div className="font-bold theme-text-primary">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Sample Table Header */}
        <div className="mt-3 theme-card rounded border theme-border p-2">
          <div className="text-xs theme-text-secondary mb-1">Employee Table Preview</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="theme-text-primary font-medium">Name</div>
            <div className="theme-text-primary font-medium">Position</div>
            <div className="theme-text-primary font-medium">Status</div>
          </div>
        </div>
      </div>
      
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}