import React from 'react';
import { ThemePreview } from './ThemePreview';
import { Theme } from './ThemeSwitcher';

interface ThemeGalleryProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onClose: () => void;
}

const themes = [
  {
    id: 'default' as Theme,
    name: 'Default Professional',
    class: 'theme-default',
    description: 'Clean and professional design for corporate environments'
  },
  {
    id: 'dark' as Theme,
    name: 'Dark Professional',
    class: 'theme-dark',
    description: 'Modern dark theme that reduces eye strain during long work sessions'
  },
  {
    id: 'vibrant' as Theme,
    name: 'Vibrant Corporate',
    class: 'theme-vibrant',
    description: 'Energetic orange theme that promotes creativity and engagement'
  },
  {
    id: 'nature' as Theme,
    name: 'Nature Minimalist',
    class: 'theme-nature',
    description: 'Calming green theme inspired by nature for peaceful work environment'
  },
  {
    id: 'luxury' as Theme,
    name: 'Luxury Corporate',
    class: 'theme-luxury',
    description: 'Premium gold and navy theme for high-end business applications'
  }
];

export function ThemeGallery({ currentTheme, onThemeChange, onClose }: ThemeGalleryProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Gallery</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Choose your preferred design style</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Theme Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <ThemePreview
                key={theme.id}
                themeName={theme.name}
                themeClass={theme.class}
                description={theme.description}
                isActive={currentTheme === theme.id}
                onClick={() => {
                  onThemeChange(theme.id);
                  onClose();
                }}
              />
            ))}
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Theme Features</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Automatic color scheme adaptation for all components</li>
              <li>• Optimized for both light and dark environment preferences</li>
              <li>• Enhanced readability and accessibility standards</li>
              <li>• Consistent design language across all interface elements</li>
              <li>• Your theme preference is saved automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}