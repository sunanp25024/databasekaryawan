import React from 'react';
import { Database, Building2, Users, X, BarChart3 } from 'lucide-react';

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
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'MACF':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'SMSF':
        return 'border-purple-200 bg-purple-50 text-purple-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="w-64 lg:w-72 xl:w-80 bg-gradient-to-b from-slate-50 to-blue-50/30 shadow-2xl border-r border-blue-200/50 h-screen flex flex-col backdrop-blur-sm">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between p-5 border-b border-blue-200/50 bg-white/80 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-slate-800">Menu Navigasi</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5">
        {/* Enhanced Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-14 h-14 bg-transparent rounded-2xl flex items-center justify-center">
              <img 
                src="/swapro.png" 
                alt="Swapro Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Database className="w-10 h-10 text-blue-600 hidden" />
            </div>
            <div className="ml-1">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Database Klien
              </h2>
              <p className="text-sm text-slate-600 font-medium">Pilih klien untuk filter data</p>
            </div>
          </div>
        </div>
        
        {/* All Database with enhanced styling */}
        <button
          onClick={() => {
            onKlienChange('');
            onClose();
          }}
          className={`w-full flex items-center justify-between p-4 rounded-2xl mb-4 transition-all duration-300 transform hover:scale-[1.02] ${
            selectedKlien === '' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl ring-2 ring-blue-300/50' 
              : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-lg border border-slate-200/50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
              selectedKlien === '' 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-gradient-to-br from-slate-600 to-slate-700'
            }`}>
              <Database className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="font-bold text-base">All Database</span>
              <p className={`text-xs ${selectedKlien === '' ? 'text-blue-100' : 'text-slate-500'}`}>
                Semua data karyawan
              </p>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-xl text-sm font-bold min-w-[40px] text-center ${
            selectedKlien === '' 
              ? 'bg-white/20 text-white backdrop-blur-sm' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            {totalEmployees}
          </div>
        </button>

        {/* Individual Clients with enhanced cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            Klien Individual
          </h3>
          {klienList.map((klien) => (
            <button
              key={klien}
              onClick={() => {
                onKlienChange(klien);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                selectedKlien === klien 
                  ? `bg-gradient-to-r ${getKlienColor(klien)} text-white shadow-xl ring-2 ring-opacity-50` 
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-lg border border-slate-200/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                  selectedKlien === klien 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : `bg-gradient-to-br ${getKlienColor(klien)}`
                }`}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-base">{klien}</span>
                  <p className={`text-xs ${selectedKlien === klien ? 'text-white/80' : 'text-slate-500'}`}>
                    Karyawan aktif
                  </p>
                </div>
              </div>
              <div className={`px-3 py-2 rounded-xl text-sm font-bold min-w-[40px] text-center ${
                selectedKlien === klien 
                  ? 'bg-white/20 text-white backdrop-blur-sm' 
                  : `${getKlienAccent(klien)}`
              }`}>
                {employeeCounts[klien] || 0}
              </div>
            </button>
          ))}
        </div>

        {/* Enhanced Quick Stats */}
        <div className="mt-8 p-5 bg-gradient-to-br from-white/90 to-blue-50/90 rounded-2xl border border-blue-200/50 shadow-lg backdrop-blur-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Statistik Cepat
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Total Karyawan</span>
              </div>
              <span className="font-bold text-slate-800 text-lg">{totalEmployees}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-emerald-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Total Klien</span>
              </div>
              <span className="font-bold text-slate-800 text-lg">{klienList.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}