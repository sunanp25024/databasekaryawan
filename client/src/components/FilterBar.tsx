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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
              <p className="text-sm text-gray-500">Find employees quickly</p>
            </div>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-sm font-medium rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, NIK, email, or position..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Client Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              value={filters.klien}
              onChange={(e) => onFilterChange({ ...filters, klien: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            >
              <option value="">All Clients</option>
              {klienOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Area
            </label>
            <select
              value={filters.area}
              onChange={(e) => onFilterChange({ ...filters, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            >
              <option value="">All Areas</option>
              {areaOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Status I Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Employment Status
            </label>
            <select
              value={filters.statusI}
              onChange={(e) => onFilterChange({ ...filters, statusI: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            >
              <option value="">All Status</option>
              {statusIOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Status II Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Contract Type
            </label>
            <select
              value={filters.statusII}
              onChange={(e) => onFilterChange({ ...filters, statusII: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            >
              <option value="">All Types</option>
              {statusIIOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                </span>
              )}
              {Object.entries(filters).map(([key, value]) => 
                value && (
                  <span key={key} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {key}: {value}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}