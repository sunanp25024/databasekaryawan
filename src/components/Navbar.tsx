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
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-800/30 sticky top-0 z-30 backdrop-blur-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl text-blue-200 hover:text-white hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 backdrop-blur-sm"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Enhanced Logo */}
            <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl shadow-lg ring-2 ring-blue-300/50 ring-offset-2 ring-offset-slate-900">
              <img 
                src="/swapro.png" 
                alt="Swapro Logo" 
                className="w-8 h-8 lg:w-10 lg:h-10 object-contain filter brightness-110 contrast-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Database className="w-6 h-6 lg:w-8 lg:h-8 text-white hidden drop-shadow-sm" />
            </div>
            
            {/* Enhanced Title */}
            <div className="flex flex-col">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
                Database Karyawan
              </h1>
              <p className="hidden sm:block text-sm lg:text-base text-blue-200/90 font-medium tracking-wide">
                Manajemen Data Karyawan Multi-Divisi
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Desktop buttons with enhanced styling */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <button
                onClick={onImport}
                className="inline-flex items-center px-4 lg:px-5 py-2.5 lg:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm lg:text-base font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ring-1 ring-emerald-500/20"
              >
                <Upload className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Import
              </button>
              <button
                onClick={onExport}
                className="inline-flex items-center px-4 lg:px-5 py-2.5 lg:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm lg:text-base font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ring-1 ring-amber-500/20"
              >
                <Download className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
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
                className="text-sm px-3 py-2 bg-slate-800/50 border border-blue-600/30 text-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
              >
                <option value="">Actions</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
              </select>
            </div>
            
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white text-sm lg:text-base font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ring-1 ring-blue-500/30"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span className="hidden sm:inline">Tambah Karyawan</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}