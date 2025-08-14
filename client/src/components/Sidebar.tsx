import React from 'react';
import { Database, Building2, Users, X, BarChart3, TrendingUp } from 'lucide-react';
import { ClientLogo } from './ClientLogo';

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
        return 'from-blue-600 to-blue-700';
      case 'MACF':
        return 'from-emerald-600 to-emerald-700';
      case 'SMSF':
        return 'from-purple-600 to-purple-700';
      default:
        return 'from-gray-600 to-gray-700';
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
    <div className="w-64 sm:w-72 lg:w-80 bg-gradient-to-b from-white via-slate-50 to-blue-50/50 shadow-2xl border-r border-slate-200/50 h-full flex flex-col backdrop-blur-sm">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-blue-200/50">
            <img 
              src="/app-icon-192.png" 
              alt="SWAPRO Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Filter Klien</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-blue-200/50">
              <img 
                src="/app-icon-192.png" 
                alt="SWAPRO Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Filter Klien
              </h2>
              <p className="text-sm text-slate-600 font-semibold">Pilih klien untuk filter data</p>
            </div>
          </div>
        </div>
        
        {/* All Database Button */}
        <button
          onClick={() => {
            onKlienChange('');
            onClose();
          }}
          className={`w-full flex items-center justify-between p-4 lg:p-5 rounded-xl lg:rounded-2xl mb-4 lg:mb-5 transition-all duration-300 transform hover:scale-[1.02] ${
            selectedKlien === '' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl ring-2 ring-blue-300/50' 
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-lg border border-slate-200/50'
          }`}
        >
          <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
              selectedKlien === '' 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-gradient-to-br from-slate-600 to-slate-700'
            }`}>
              <Database className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <span className="font-black text-sm lg:text-base block truncate">Semua Database</span>
              <p className={`text-xs font-medium truncate ${selectedKlien === '' ? 'text-blue-100' : 'text-slate-500'}`}>
                Seluruh data karyawan
              </p>
            </div>
          </div>
          <div className={`px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-black min-w-[40px] lg:min-w-[50px] text-center flex-shrink-0 ${
            selectedKlien === '' 
              ? 'bg-white/20 text-white backdrop-blur-sm' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            {totalEmployees}
          </div>
        </button>

        {/* Individual Clients */}
        <div className="space-y-3 lg:space-y-4">
          <h3 className="text-xs lg:text-sm font-black text-slate-600 uppercase tracking-wider mb-4 lg:mb-5 flex items-center">
            <Building2 className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
            Klien Individual
          </h3>
          {klienList.map((klien) => (
            <button
              key={klien}
              onClick={() => {
                onKlienChange(klien);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-4 lg:p-5 rounded-xl lg:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                selectedKlien === klien 
                  ? `bg-gradient-to-r ${getKlienColor(klien)} text-white shadow-xl ring-2 ring-opacity-50` 
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-lg border border-slate-200/50'
              }`}
            >
              <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden ${
                  selectedKlien === klien 
                    ? 'bg-white/20 backdrop-blur-sm border-2 border-white/30' 
                    : 'bg-white border border-slate-200'
                }`}>
                  <ClientLogo 
                    client={klien} 
                    size="md" 
                    className="w-full h-full flex items-center justify-center"
                  />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <span className="font-black text-sm lg:text-base block truncate">{klien}</span>
                  <p className={`text-xs font-medium truncate ${selectedKlien === klien ? 'text-white/80' : 'text-slate-500'}`}>
                    Karyawan aktif
                  </p>
                </div>
              </div>
              <div className={`px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm font-black min-w-[40px] lg:min-w-[50px] text-center flex-shrink-0 ${
                selectedKlien === klien 
                  ? 'bg-white/20 text-white backdrop-blur-sm' 
                  : `${getKlienAccent(klien)}`
              }`}>
                {employeeCounts[klien] || 0}
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-gradient-to-br from-white to-blue-50/80 rounded-xl lg:rounded-2xl border border-blue-200/50 shadow-lg backdrop-blur-sm">
          <h3 className="text-sm lg:text-base font-black text-slate-800 mb-4 lg:mb-5 flex items-center">
            <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
            Statistik Cepat
          </h3>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex justify-between items-center p-3 lg:p-4 bg-white/80 rounded-lg lg:rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs lg:text-sm font-bold text-slate-700 truncate">Total Karyawan</span>
              </div>
              <span className="font-black text-slate-800 text-lg lg:text-xl flex-shrink-0">{totalEmployees}</span>
            </div>
            <div className="flex justify-between items-center p-3 lg:p-4 bg-white/80 rounded-lg lg:rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs lg:text-sm font-bold text-slate-700 truncate">Total Klien</span>
              </div>
              <span className="font-black text-slate-800 text-lg lg:text-xl flex-shrink-0">{klienList.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 lg:p-4 bg-white/80 rounded-lg lg:rounded-xl border border-purple-100 shadow-sm">
              <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs lg:text-sm font-bold text-slate-700 truncate">Rata-rata per Klien</span>
              </div>
              <span className="font-black text-slate-800 text-lg lg:text-xl flex-shrink-0">
                {totalEmployees > 0 ? Math.round(totalEmployees / klienList.length) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}