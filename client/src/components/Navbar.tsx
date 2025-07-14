import React from 'react';
import { Users, Database, Plus, Download, Upload, Menu, X, Trash2, MoreVertical } from 'lucide-react';

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
    <nav className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Employee Management
                </h1>
                <p className="text-sm text-gray-500 -mt-0.5">
                  Database System
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={onDownloadTemplate}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Template
              </button>
              
              <button
                onClick={onImport}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 rounded-lg transition-all duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
              
              <button
                onClick={onExport}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <button
                onClick={onClearAllData}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <select 
                onChange={(e) => {
                  if (e.target.value === 'template') onDownloadTemplate();
                  if (e.target.value === 'import') onImport();
                  if (e.target.value === 'export') onExport();
                  if (e.target.value === 'clear') onClearAllData();
                  e.target.value = '';
                }}
                className="text-sm px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Actions</option>
                <option value="template">Download Template</option>
                <option value="import">Import Data</option>
                <option value="export">Export Data</option>
                <option value="clear">Clear All Data</option>
              </select>
            </div>
            
            {/* Add Employee Button */}
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Employee</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}