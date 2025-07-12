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
    <div className="w-72 lg:w-72 xl:w-80 bg-gradient-to-b from-white via-slate-50 to-blue-50/50 shadow-2xl border-r border-slate-200/50 h-screen flex flex-col backdrop-blur-sm">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-slate-800">Menu Navigasi</h2>
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {/* Enhanced Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-200/50">
              <img 
                src="/swapro.png" 
                alt="Swapro Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <Database className="w-12 h-12 text-blue-600 hidden" />
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Filter Klien
              </h2>
              <p className="text-sm text-slate-600 font-semibold">Pilih klien untuk filter data</p>
            </div>
          </div>
        </div>
        
        {/* All Database with enhanced styling */}
        <button
          onClick={() => {
            onKlienChange('');
            onClose();
          }}
          className={`w-full flex items-center justify-between p-5 rounded-2xl mb-5 transition-all duration-300 transform hover:scale-[1.02] ${
            selectedKlien === '' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl ring-2 ring-blue-300/50' 
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-lg border border-slate-200/50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
              selectedKlien === '' 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-gradient-to-br from-slate-600 to-slate-700'
            }`}>
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-black text-base">Semua Database</span>
              <p className={`text-xs font-medium ${selectedKlien === '' ? 'text-blue-100' : 'text-slate-500'}`}>
                Seluruh data karyawan
              </p>
            </div>
          </div>
          <div className={`px-4 py-2.5 rounded-xl text-sm font-black min-w-[50px] text-center ${
            selectedKlien === '' 
              ? 'bg-white/20 text-white backdrop-blur-sm' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            {totalEmployees}
          </div>
        </button>

        {/* Individual Clients with enhanced cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider mb-5 flex items-center">
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
              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                selectedKlien === klien 
                  ? `bg-gradient-to-r ${getKlienColor(klien)} text-white shadow-xl ring-2 ring-opacity-50` 
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-lg border border-slate-200/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                  selectedKlien === klien 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : `bg-gradient-to-br ${getKlienColor(klien)}`
                }`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-black text-base">{klien}</span>
                  <p className={`text-xs font-medium ${selectedKlien === klien ? 'text-white/80' : 'text-slate-500'}`}>
                    Karyawan aktif
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2.5 rounded-xl text-sm font-black min-w-[50px] text-center ${
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
        <div className="mt-8 p-6 bg-gradient-to-br from-white to-blue-50/80 rounded-2xl border border-blue-200/50 shadow-lg backdrop-blur-sm">
          <h3 className="text-base font-black text-slate-800 mb-5 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Statistik Cepat
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-bold text-slate-700">Total Karyawan</span>
              </div>
              <span className="font-black text-slate-800 text-xl">{totalEmployees}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-bold text-slate-700">Total Klien</span>
              </div>
              <span className="font-black text-slate-800 text-xl">{klienList.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-purple-100 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-bold text-slate-700">Rata-rata per Klien</span>
              </div>
              <span className="font-black text-slate-800 text-xl">
                {totalEmployees > 0 ? Math.round(totalEmployees / klienList.length) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}