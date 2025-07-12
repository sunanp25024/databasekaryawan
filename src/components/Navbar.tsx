import React from 'react';
import { Users, Database, Plus, Download, Upload, Menu, X } from 'lucide-react';

interface NavbarProps {
  onAddEmployee: () => void;
  onExport: () => void;
  onImport: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Navbar({ onAddEmployee, onExport, onImport, onToggleSidebar, sidebarOpen }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <img 
                src="/swapro.png" 
                alt="Swapro Logo" 
                className="w-5 h-5 lg:w-7 lg:h-7 object-contain"
                onError={(e) => {
                  // Fallback to icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Database className="w-4 h-4 lg:w-6 lg:h-6 text-white hidden" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Database Karyawan
              </h1>
              <p className="hidden sm:block text-xs lg:text-sm text-gray-600 font-medium">
                Manajemen Data Karyawan Multi-Divisi
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <button
              onClick={onImport}
                className="inline-flex items-center px-2 lg:px-3 py-1.5 lg:py-2 bg-green-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
                <Upload className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Import
            </button>
            <button
              onClick={onExport}
                className="inline-flex items-center px-2 lg:px-3 py-1.5 lg:py-2 bg-gray-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
                <Download className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Export
            </button>
            </div>
            
            {/* Mobile action menu */}
            <div className="md:hidden">
              <select 
                onChange={(e) => {
                  if (e.target.value === 'import') onImport();
                  if (e.target.value === 'export') onExport();
                  e.target.value = '';
                }}
                className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Actions</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
              </select>
            </div>
            
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center px-2 lg:px-4 py-1.5 lg:py-2 bg-blue-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Tambah Karyawan</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}