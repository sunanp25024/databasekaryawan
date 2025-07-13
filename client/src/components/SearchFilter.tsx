import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Division } from '../types/Employee';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDivision: string;
  onDivisionChange: (division: string) => void;
  divisions: Division[];
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedDivision,
  onDivisionChange,
  divisions
}: SearchFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search employees by name, email, or position..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={selectedDivision}
            onChange={(e) => onDivisionChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Divisions</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.name}>
                {division.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}