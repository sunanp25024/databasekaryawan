import React from 'react';
import { Database, Building2, Users, X } from 'lucide-react';

interface SidebarProps {
  selectedKlien: string;
  onKlienChange: (klien: string) => void;
  employeeCounts: { [key: string]: number };
  totalEmployees: number;
  onClose: () => void;
}

export function Sidebar({ selectedKlien, onKlienChange, employeeCounts, totalEmployees, onClose }: SidebarProps) {
  const klienList = ['ADIRA', 'MACF', 'SMSF'];

  const getKlienColor = (klien: string) => {
    switch (klien) {
      case 'ADIRA':
        return 'bg-blue-500';
      case 'MACF':
        return 'bg-green-500';
      case 'SMSF':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-64 lg:w-64 xl:w-72 bg-white shadow-xl border-r border-gray-200 h-screen flex flex-col">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="hidden lg:block mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md flex items-center justify-center">
              <img 
                src="/swapro.png" 
                alt="Swapro Logo" 
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Database className="w-4 h-4 text-white hidden" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Database Klien
            </h2>
          </div>
        </div>
        
        {/* All Database */}
        <button
          onClick={() => {
            onKlienChange('');
            onClose();
          }}
          className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors duration-200 ${
            selectedKlien === '' 
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-sm">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">All Database</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium min-w-[24px] text-center ${
            selectedKlien === '' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {totalEmployees}
          </span>
        </button>

        {/* Individual Clients */}
        <div className="space-y-2">
          {klienList.map((klien) => (
            <button
              key={klien}
              onClick={() => {
                onKlienChange(klien);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                selectedKlien === klien 
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getKlienColor(klien)} rounded-lg flex items-center justify-center shadow-sm`}>
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{klien}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium min-w-[24px] text-center ${
                selectedKlien === klien 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {employeeCounts[klien] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Quick Stats
          </h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Total Karyawan:</span>
              <span className="font-semibold text-gray-800">{totalEmployees}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Klien:</span>
              <span className="font-semibold text-gray-800">{klienList.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}