import React from 'react';
import { Database, Building2, Users, X, BarChart3, TrendingUp } from 'lucide-react';

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
        return 'from-blue-500 to-blue-600';
      case 'MACF':
        return 'from-emerald-500 to-emerald-600';
      case 'SMSF':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getKlienAccent = (klien: string) => {
    switch (klien) {
      case 'ADIRA':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'MACF':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'SMSF':
        return 'border-purple-200 bg-purple-50 text-purple-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Client Filter</h2>
              <p className="text-sm text-gray-500">Select client view</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="p-6 border-b border-gray-200">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Total Employees</span>
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
          <div className="text-xs text-gray-500 mt-1">All clients combined</div>
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Clients</h3>
        <div className="space-y-3">
          {/* All Clients Option */}
          <button
            onClick={() => onKlienChange('')}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
              selectedKlien === '' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  selectedKlien === '' ? 'bg-white' : 'bg-blue-500'
                }`}></div>
                <span className="font-semibold">All Clients</span>
              </div>
              <span className={`text-sm font-bold ${
                selectedKlien === '' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {totalEmployees}
              </span>
            </div>
          </button>

          {/* Individual Clients */}
          {klienList.map((klien) => (
            <button
              key={klien}
              onClick={() => onKlienChange(klien)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                selectedKlien === klien
                  ? `bg-gradient-to-r ${getKlienColor(klien)} text-white shadow-lg`
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedKlien === klien ? 'bg-white' : getKlienColor(klien).includes('blue') ? 'bg-blue-500' : getKlienColor(klien).includes('emerald') ? 'bg-emerald-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="font-semibold">{klien}</span>
                </div>
                <span className={`text-sm font-bold ${
                  selectedKlien === klien ? 'text-white opacity-90' : 'text-gray-500'
                }`}>
                  {employeeCounts[klien] || 0}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BarChart3 className="w-4 h-4" />
          <span>Real-time employee data</span>
        </div>
      </div>
    </div>
  );
}