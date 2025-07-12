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
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl border-b border-blue-700/30 sticky top-0 z-30 backdrop-blur-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="p-3 rounded-xl text-blue-200 hover:text-white hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 backdrop-blur-sm lg:hidden"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Enhanced Logo */}
            <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-xl">
              <img 
                src="/swapro.png" 
                alt="Swapro Logo" 
                className="w-12 h-12 lg:w-16 lg:h-16 object-contain filter brightness-110 contrast-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <Database className="w-12 h-12 lg:w-16 lg:h-16 text-blue-300 hidden drop-shadow-lg" />
            </div>
            
            {/* Enhanced Title */}
            <div className="flex flex-col">
              <h1 className="text-xl lg:text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
                Database Karyawan
              </h1>
              <p className="hidden sm:block text-sm lg:text-base text-blue-200/90 font-semibold tracking-wide">
                Sistem Manajemen Data Karyawan Terpadu
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Desktop buttons with enhanced styling */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={onImport}
                className="inline-flex items-center px-5 lg:px-6 py-3 lg:py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm lg:text-base font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ring-1 ring-emerald-500/30 border border-emerald-500/20"
              >
                <Upload className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Import Data
              </button>
              <button
                onClick={onExport}
                className="inline-flex items-center px-5 lg:px-6 py-3 lg:py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm lg:text-base font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ring-1 ring-amber-500/30 border border-amber-500/20"
              >
                <Download className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Export Data
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
                className="text-sm px-3 py-2.5 bg-slate-800/60 border border-blue-600/40 text-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 backdrop-blur-sm font-medium"
              >
                <option value="">Menu</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
              </select>
            </div>
            
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center px-5 lg:px-8 py-3 lg:py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white text-sm lg:text-base font-black rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 ring-1 ring-blue-500/30 border border-blue-500/20"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span className="hidden sm:inline">Tambah Karyawan</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}