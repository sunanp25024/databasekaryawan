import React from 'react';
import { Search, Filter, X, Sparkles } from 'lucide-react';
import { FilterOptions } from '../types/Employee';
import { klienOptions, statusIOptions, statusIIOptions } from '../data/mockData';

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
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-gradient-to-r from-white via-blue-50/50 to-white rounded-3xl shadow-xl border border-blue-200/50 p-6 lg:p-8 mb-8 backdrop-blur-sm">
      <div className="flex flex-col space-y-5 lg:space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Filter & Pencarian</h3>
            <p className="text-sm text-gray-600">Temukan karyawan dengan mudah</p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative">
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500">
            <Search className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama karyawan, NIK, email, atau posisi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 lg:pl-16 pr-6 py-4 lg:py-5 text-base lg:text-lg border-2 border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 font-medium shadow-lg hover:shadow-xl"
          />
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Klien
            </label>
            <select
              value={filters.klien}
              onChange={(e) => onFilterChange({ ...filters, klien: e.target.value })}
              className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium shadow-md hover:shadow-lg"
            >
              <option value="">Semua Klien</option>
              {klienOptions.map((klien) => (
                <option key={klien} value={klien}>{klien}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Area
            </label>
            <input
              type="text"
              placeholder="Filter berdasarkan area"
              value={filters.area}
              onChange={(e) => onFilterChange({ ...filters, area: e.target.value })}
              className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium shadow-md hover:shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Cabang
            </label>
            <input
              type="text"
              placeholder="Filter berdasarkan cabang"
              value={filters.cabang}
              onChange={(e) => onFilterChange({ ...filters, cabang: e.target.value })}
              className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium shadow-md hover:shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              Status I
            </label>
            <select
              value={filters.statusI}
              onChange={(e) => onFilterChange({ ...filters, statusI: e.target.value })}
              className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium shadow-md hover:shadow-lg"
            >
              <option value="">Semua Status</option>
              {statusIOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
              Status II
            </label>
            <select
              value={filters.statusII}
              onChange={(e) => onFilterChange({ ...filters, statusII: e.target.value })}
              className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium shadow-md hover:shadow-lg"
            >
              <option value="">Semua Tipe</option>
              {statusIIOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="w-full inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ring-2 ring-red-200"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}