import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterOptions } from '../types/Employee';
import { klienOptions, sentraOptions, cabangOptions, statusIOptions, statusIIOptions } from '../data/mockData';

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama karyawan, NIK, email, atau posisi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Klien</label>
            <select
              value={filters.klien}
              onChange={(e) => onFilterChange({ ...filters, klien: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Klien</option>
              {klienOptions.map((klien) => (
                <option key={klien} value={klien}>{klien}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sentra</label>
            <select
              value={filters.sentra}
              onChange={(e) => onFilterChange({ ...filters, sentra: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Sentra</option>
              {sentraOptions.map((sentra) => (
                <option key={sentra} value={sentra}>{sentra}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cabang</label>
            <select
              value={filters.cabang}
              onChange={(e) => onFilterChange({ ...filters, cabang: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Cabang</option>
              {cabangOptions.map((cabang) => (
                <option key={cabang} value={cabang}>{cabang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status I</label>
            <select
              value={filters.statusI}
              onChange={(e) => onFilterChange({ ...filters, statusI: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              {statusIOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status II</label>
            <select
              value={filters.statusII}
              onChange={(e) => onFilterChange({ ...filters, statusII: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
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