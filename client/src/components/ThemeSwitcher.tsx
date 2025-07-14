import React, { useState } from 'react';
import { Palette, Sun, Moon, Leaf, Crown, Zap, Eye } from 'lucide-react';
import { ThemeGallery } from './ThemeGallery';

export type Theme = 'default' | 'dark' | 'vibrant' | 'nature' | 'luxury';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes = [
  {
    id: 'default' as Theme,
    name: 'Default',
    icon: Sun,
    description: 'Clean & Professional',
    colors: ['#3b82f6', '#1e293b', '#f8fafc']
  },
  {
    id: 'dark' as Theme,
    name: 'Dark Pro',
    icon: Moon,
    description: 'Dark Professional',
    colors: ['#60a5fa', '#f1f5f9', '#0f172a']
  },
  {
    id: 'vibrant' as Theme,
    name: 'Vibrant',
    icon: Zap,
    description: 'Energetic Corporate',
    colors: ['#f59e0b', '#92400e', '#fef3c7']
  },
  {
    id: 'nature' as Theme,
    name: 'Nature',
    icon: Leaf,
    description: 'Calm & Natural',
    colors: ['#22c55e', '#14532d', '#f0fdf4']
  },
  {
    id: 'luxury' as Theme,
    name: 'Luxury',
    icon: Crown,
    description: 'Premium Gold',
    colors: ['#fbbf24', '#fbbf24', '#1e1b4b']
  }
];

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200 backdrop-blur-sm"
        >
          <Palette className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Theme</span>
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Choose Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred design style</p>
              </div>
              
              <div className="p-2 space-y-1">
                {themes.map((theme) => {
                  const IconComponent = theme.icon;
                  const isActive = currentTheme === theme.id;
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        onThemeChange(theme.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' 
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          isActive 
                            ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400' 
                            : 'bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-400'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{theme.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{theme.description}</div>
                        </div>
                        
                        <div className="flex space-x-1">
                          {theme.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-gray-300 dark:border-slate-600"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                <button
                  onClick={() => {
                    setShowGallery(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Themes
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Theme preference saved automatically
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      {showGallery && (
        <ThemeGallery
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}