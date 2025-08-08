import React from 'react';
import { Users, Database, Plus, Download, Upload, Menu, X, Trash2 } from 'lucide-react';

interface NavbarProps {
  onAddEmployee: () => void;
  onExport: () => void;
  onImport: () => void;
  onDownloadTemplate: () => void;
  onClearAllData: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Navbar({ onAddEmployee, onExport, onImport, onDownloadTemplate, onClearAllData, onToggleSidebar, sidebarOpen }: NavbarProps) {
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl border-b border-blue-700/30 sticky top-0 z-40 backdrop-blur-lg">
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">
          {/* Left Section - Mobile menu + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={onToggleSidebar}
              className="p-2 sm:p-2.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {/* Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white rounded-xl border border-blue-200/50 shadow-xl flex-shrink-0">
                <img 
                  src="/app-icon-192.png" 
                  alt="SWAPRO Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                />
              </div>
              
              {/* Title */}
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg lg:text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-lg tracking-tight truncate">
                  Database Karyawan
                </h1>
                <p className="hidden sm:block text-xs lg:text-sm text-blue-200/90 font-medium tracking-wide truncate">
                  Sistem Manajemen Data Karyawan
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={onDownloadTemplate}
                className="inline-flex items-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs lg:text-sm font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Download className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Template</span>
                <span className="lg:hidden">Template</span>
              </button>
              <button
                onClick={onImport}
                className="inline-flex items-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs lg:text-sm font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Upload className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Import</span>
                <span className="lg:hidden">Import</span>
              </button>
              <button
                onClick={onExport}
                className="inline-flex items-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs lg:text-sm font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Download className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Export</span>
                <span className="lg:hidden">Export</span>
              </button>
              <button
                onClick={onClearAllData}
                className="inline-flex items-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs lg:text-sm font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Clear All</span>
                <span className="lg:hidden">Clear</span>
              </button>
            </div>
            
            {/* Mobile dropdown */}
            <div className="md:hidden">
              <select 
                onChange={(e) => {
                  if (e.target.value === 'template') onDownloadTemplate();
                  if (e.target.value === 'import') onImport();
                  if (e.target.value === 'export') onExport();
                  if (e.target.value === 'clear') onClearAllData();
                  e.target.value = '';
                }}
                className="text-xs px-2 py-2 bg-slate-800/60 border border-blue-600/40 text-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 backdrop-blur-sm font-medium"
              >
                <option value="">Menu</option>
                <option value="template">Download Template</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
                <option value="clear">Clear All Data</option>
              </select>
            </div>
            
            {/* Add Employee Button */}
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center px-2 sm:px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white text-xs lg:text-sm font-black rounded-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline lg:hidden">Tambah</span>
              <span className="hidden lg:inline">Tambah Karyawan</span>
              <span className="sm:hidden">+</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}