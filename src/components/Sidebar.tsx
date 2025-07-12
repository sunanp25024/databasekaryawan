import React from 'react';
import { Database, Building2, Users } from 'lucide-react';

interface SidebarProps {
  selectedKlien: string;
  onKlienChange: (klien: string) => void;
  employeeCounts: { [key: string]: number };
  totalEmployees: number;
}

export function Sidebar({ selectedKlien, onKlienChange, employeeCounts, totalEmployees }: SidebarProps) {
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
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen sticky top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Klien</h2>
        
        {/* All Database */}
        <button
          onClick={() => onKlienChange('')}
          className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors duration-200 ${
            selectedKlien === '' 
              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">All Database</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
              onClick={() => onKlienChange(klien)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                selectedKlien === klien 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getKlienColor(klien)} rounded-lg flex items-center justify-center`}>
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{klien}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Quick Stats
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Total Karyawan:</span>
              <span className="font-medium">{totalEmployees}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Klien:</span>
              <span className="font-medium">{klienList.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}