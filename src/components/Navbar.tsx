import React from 'react';
import { Users, Database, Plus, Download, Upload } from 'lucide-react';

interface NavbarProps {
  onAddEmployee: () => void;
  onExport: () => void;
  onImport: () => void;
}

export function Navbar({ onAddEmployee, onExport, onImport }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Database Karyawan</h1>
              <p className="text-sm text-gray-500">Manajemen Data Karyawan Multi-Divisi</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onImport}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button
              onClick={onExport}
              className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Karyawan
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}