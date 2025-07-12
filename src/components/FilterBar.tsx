import React from 'react';
import { Search, Filter, X } from 'lucide-react';
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-7 mb-8 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col space-y-3 lg:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama karyawan, NIK, email, atau posisi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 lg:pl-12 pr-4 py-3 lg:py-4 text-sm lg:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          <div>
            <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-2">Klien</label>
            <select
              value={filters.klien}
              onChange={(e) => onFilterChange({ ...filters, klien: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
            >
              <option value="">Semua Klien</option>
              {klienOptions.map((klien) => (
                <option key={klien} value={klien}>{klien}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-2">Area</label>
            <input
              type="text"
              placeholder="Filter berdasarkan area"
              value={filters.area}
              onChange={(e) => onFilterChange({ ...filters, area: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 lg:mb-1.5">Cabang</label>
            <input
              type="text"
              placeholder="Filter berdasarkan cabang"
              value={filters.cabang}
              onChange={(e) => onFilterChange({ ...filters, cabang: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 lg:mb-1.5">Status I</label>
            <select
              value={filters.statusI}
              onChange={(e) => onFilterChange({ ...filters, statusI: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
            >
              <option value="">Semua Status</option>
              {statusIOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 lg:mb-1.5">Status II</label>
            <select
              value={filters.statusII}
              onChange={(e) => onFilterChange({ ...filters, statusII: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
            >
              <option value="">Semua Tipe</option>
              {statusIIOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 md:col-span-1">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}