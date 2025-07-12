import React from 'react';
import { Search, Filter, X, Sparkles, Sliders } from 'lucide-react';
import { FilterOptions } from '../types/Employee';
import { klienOptions, statusIOptions, statusIIOptions, areaOptions } from '../data/mockData';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters
}: FilterBarProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== '';

  return (
    <div className="bg-gradient-to-r from-white via-slate-50 to-white rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl border border-slate-200/50 p-4 lg:p-8 mb-6 lg:mb-8 backdrop-blur-sm">
      <div className="flex flex-col space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-2">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg lg:shadow-xl flex-shrink-0">
              <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg lg:text-xl font-black text-gray-900 truncate">Filter & Pencarian Data</h3>
              <p className="text-xs lg:text-sm text-gray-600 font-semibold truncate">Temukan karyawan dengan mudah dan cepat</p>
            </div>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs lg:text-sm font-bold rounded-lg lg:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 self-start sm:self-center"
            >
              <X className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Clear All
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 text-blue-600">
            <Search className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama karyawan, NIK, email, atau posisi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 lg:pl-16 pr-12 lg:pr-16 py-3 lg:py-5 text-sm lg:text-lg border-2 border-slate-200/50 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white/90 backdrop-blur-sm placeholder-gray-500 font-semibold shadow-md lg:shadow-lg hover:shadow-lg lg:hover:shadow-xl"
          />
          <div className="absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md lg:shadow-lg">
              <Sliders className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-6">
          <div>
            <label className="block text-xs lg:text-sm font-black text-gray-700 mb-2 lg:mb-3 flex items-center">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-600 rounded-full mr-2"></div>
              Klien
            </label>
            <select
              value={filters.klien}
              onChange={(e) => onFilterChange({ ...filters, klien: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 text-xs lg:text-sm border-2 border-gray-200 rounded-lg lg:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white/95 backdrop-blur-sm font-semibold shadow-sm lg:shadow-md hover:shadow-md lg:hover:shadow-lg"
            >
              <option value="">Semua Klien</option>
              {klienOptions.map((klien) => (
                <option key={klien} value={klien}>{klien}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-black text-gray-700 mb-2 lg:mb-3 flex items-center">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-600 rounded-full mr-2"></div>
              Area
            </label>
            <select
              value={filters.area}
              onChange={(e) => onFilterChange({ ...filters, area: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 text-xs lg:text-sm border-2 border-gray-200 rounded-lg lg:rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200 bg-white/95 backdrop-blur-sm font-semibold shadow-sm lg:shadow-md hover:shadow-md lg:hover:shadow-lg"
            >
              <option value="">Semua Area</option>
              {areaOptions.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-black text-gray-700 mb-2 lg:mb-3 flex items-center">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-600 rounded-full mr-2"></div>
              Cabang
            </label>
            <input
              type="text"
              placeholder="Filter berdasarkan cabang"
              value={filters.cabang}
              onChange={(e) => onFilterChange({ ...filters, cabang: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 text-xs lg:text-sm border-2 border-gray-200 rounded-lg lg:rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 bg-white/95 backdrop-blur-sm font-semibold shadow-sm lg:shadow-md hover:shadow-md lg:hover:shadow-lg"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-black text-gray-700 mb-2 lg:mb-3 flex items-center">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-amber-600 rounded-full mr-2"></div>
              Status I
            </label>
            <select
              value={filters.statusI}
              onChange={(e) => onFilterChange({ ...filters, statusI: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 text-xs lg:text-sm border-2 border-gray-200 rounded-lg lg:rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-200 bg-white/95 backdrop-blur-sm font-semibold shadow-sm lg:shadow-md hover:shadow-md lg:hover:shadow-lg"
            >
              <option value="">Semua Status</option>
              {statusIOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs lg:text-sm font-black text-gray-700 mb-2 lg:mb-3 flex items-center">
              <div className="w-2 h-2 lg:w-3 lg:h-3 bg-indigo-600 rounded-full mr-2"></div>
              Status II
            </label>
            <select
              value={filters.statusII}
              onChange={(e) => onFilterChange({ ...filters, statusII: e.target.value })}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 text-xs lg:text-sm border-2 border-gray-200 rounded-lg lg:rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 bg-white/95 backdrop-blur-sm font-semibold shadow-sm lg:shadow-md hover:shadow-md lg:hover:shadow-lg"
            >
              <option value="">Semua Tipe</option>
              {statusIIOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}