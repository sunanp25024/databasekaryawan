import React, { useState } from 'react';
import { Edit, Trash2, Eye, Users, Plus, UserPlus, Grid3X3, List, User, Building, Calendar, CreditCard, Phone, Mail, MapPin, Briefcase, Clock, Award, Shield, BadgeCheck, UserCheck, X, Badge } from 'lucide-react';
import { Employee } from '../types/Employee';
import { ClientLogo } from './ClientLogo';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onView: (employee: Employee) => void;
}

export function EmployeeTable({ employees, onEdit, onDelete, onView }: EmployeeTableProps) {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status: string, type: 'primary' | 'secondary' = 'primary') => {
    const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm";
    
    if (type === 'primary') {
      switch (status.toUpperCase()) {
        case 'AKTIF':
        case 'ACTIVE':
          return { className: `${baseClasses} bg-emerald-100 text-emerald-800 border border-emerald-200`, icon: <UserCheck className="w-3 h-3 mr-1" /> };
        case 'RESIGN':
        case 'RESIGNED':
          return { className: `${baseClasses} bg-red-100 text-red-800 border border-red-200`, icon: <Clock className="w-3 h-3 mr-1" /> };
        case 'TERMINATED':
          return { className: `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`, icon: <X className="w-3 h-3 mr-1" /> };
        default:
          return { className: `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`, icon: <User className="w-3 h-3 mr-1" /> };
      }
    } else {
      switch (status) {
        case 'Contract':
          return { className: `${baseClasses} bg-orange-100 text-orange-800 border border-orange-200`, icon: <Clock className="w-3 h-3 mr-1" /> };
        default:
          return { className: `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`, icon: <User className="w-3 h-3 mr-1" /> };
      }
    }
  };

  const getKlienBadge = (klien: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold";
    switch (klien) {
      case 'ADIRA':
        return { className: `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200` };
      case 'MACF':
        return { className: `${baseClasses} bg-green-50 text-green-700 border border-green-200` };
      case 'SMSF':
        return { className: `${baseClasses} bg-purple-50 text-purple-700 border border-purple-200` };
      default:
        return { className: `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200` };
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Header dengan Toggle View Mode */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">Data Karyawan</h2>
            <p className="text-sm text-gray-600 font-semibold">{employees.length} karyawan</p>
          </div>
        </div>
        
        {/* Toggle View Mode */}
        <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setViewMode('card')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'card'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Card
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <List className="w-4 h-4 mr-2" />
            Table
          </button>
        </div>
      </div>

      {/* Enhanced Card View */}
      <div className={viewMode === 'card' ? 'block' : 'hidden'}>
        <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {employees.map((employee) => {
              const statusPrimary = getStatusBadge(employee.statusI, 'primary');
              const statusSecondary = getStatusBadge(employee.statusII, 'secondary');
              const klienBadge = getKlienBadge(employee.klien);
              
              return (
                <div key={employee.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-gray-900 truncate mb-1">{employee.namaKaryawan}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm font-semibold truncate">{employee.posisi}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-3">
                        <button
                          onClick={() => onView(employee)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(employee)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(employee.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 group"
                          title="Hapus Karyawan"
                        >
                          <Trash2 className="w-4 h-4 group-hover:animate-pulse" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={statusPrimary.className}>
                        {statusPrimary.icon}
                        {employee.statusI}
                      </span>
                      <span className={statusSecondary.className}>
                        {statusSecondary.icon}
                        {employee.statusII}
                      </span>
                    </div>
                    
                    {/* Client & Location */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ClientLogo client={employee.klien} size="sm" />
                        <span className={klienBadge.className}>
                          {employee.klien}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="font-medium">{employee.area}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex items-center text-gray-600">
                        <CreditCard className="w-3 h-3 mr-2 text-indigo-500" />
                        <span className="font-medium text-gray-500">NIK:</span>
                        <span className="font-mono font-semibold ml-1">{employee.nik}</span>
                      </div>
                      
                      {employee.alamatEmail && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-3 h-3 mr-2 text-green-500" />
                          <span className="font-semibold truncate">{employee.alamatEmail}</span>
                        </div>
                      )}
                      
                      {employee.noTelp && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-3 h-3 mr-2 text-blue-500" />
                          <span className="font-semibold">{employee.noTelp}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-3 h-3 mr-2 text-purple-500" />
                        <span className="font-medium text-gray-500">Bergabung:</span>
                        <span className="font-semibold ml-1">{formatDate(employee.tglJoint)}</span>
                      </div>
                      
                      {employee.cabang && (
                        <div className="flex items-center text-gray-600">
                          <Building className="w-3 h-3 mr-2 text-orange-500" />
                          <span className="font-medium text-gray-500">Cabang:</span>
                          <span className="font-semibold ml-1">{employee.cabang}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Warning Letters */}
                    {employee.suratPeringatan && employee.suratPeringatan.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center mb-2">
                          <Award className="w-3 h-3 mr-1 text-red-500" />
                          <span className="text-xs font-medium text-gray-500">Surat Peringatan:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {employee.suratPeringatan.map((sp: any) => (
                            <span
                              key={sp.id}
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                sp.type === 'SP1'
                                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                  : sp.type === 'SP2'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-red-200 text-red-900 border border-red-300'
                              }`}
                            >
                              {sp.type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Enhanced Professional Table View */}
      <div className={`${viewMode === 'table' ? 'block' : 'hidden'}`}>
        <div className="max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 sticky top-0 z-10 shadow-sm">
              <tr>
                {/* Core Identity Columns */}
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider sticky left-0 bg-gradient-to-r from-slate-50 to-blue-50 z-20 border-r border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span>#</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider border-r border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span>Klien</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider min-w-[180px]">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>Nama Karyawan</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider min-w-[140px]">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <span>NIK</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider min-w-[150px]">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-green-500" />
                    <span>Posisi</span>
                  </div>
                </th>
                
                {/* Location & Status */}
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>Area</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-teal-500" />
                    <span>Cabang</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>Status</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Badge className="w-4 h-4 text-blue-500" />
                    <span>Tipe</span>
                  </div>
                </th>
                
                {/* Contact Information */}
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider min-w-[200px]">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-red-500" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider min-w-[130px]">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>Telepon</span>
                  </div>
                </th>
                
                {/* Employment Details */}
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider min-w-[120px]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>Tgl Masuk</span>
                  </div>
                </th>
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider min-w-[100px]">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Kontrak Ke</span>
                  </div>
                </th>
                
                {/* Warning System */}
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider min-w-[140px]">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-red-500" />
                    <span>SP</span>
                  </div>
                </th>
                
                <th className="group px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider sticky right-0 bg-gradient-to-r from-slate-50 to-blue-50 z-20 border-l border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {employees.map((employee, index) => {
                const statusPrimary = getStatusBadge(employee.statusI, 'primary');
                const statusSecondary = getStatusBadge(employee.statusII, 'secondary');
                const klienBadge = getKlienBadge(employee.klien);
                
                return (
                  <tr key={employee.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-lg group`}>
                    {/* Row Number */}
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900 sticky left-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} z-10 border-r border-gray-200 group-hover:bg-blue-50`}>
                      <div className="flex items-center">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">{employee.no}</span>
                      </div>
                    </td>
                    
                    {/* Client Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <ClientLogo client={employee.klien} size="sm" />
                        <span className={klienBadge.className}>
                          {employee.klien}
                        </span>
                      </div>
                    </td>
                    
                    {/* Employee Name with Avatar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {employee.namaKaryawan.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-black text-gray-900">{employee.namaKaryawan}</div>
                          <div className="text-xs text-gray-500 font-medium">{employee.namaPic}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* NIK */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-md border">
                        {employee.nik}
                      </div>
                    </td>
                    
                    {/* Position */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm font-semibold text-gray-900">{employee.posisi}</span>
                      </div>
                    </td>
                    
                    {/* Area */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 text-orange-500 mr-2" />
                        <span className="text-sm font-semibold text-gray-900">{employee.area}</span>
                      </div>
                    </td>
                    
                    {/* Branch */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="w-3 h-3 text-teal-500 mr-2" />
                        <span className="text-sm font-semibold text-gray-900">{employee.cabang}</span>
                      </div>
                    </td>
                    
                    {/* Status Primary */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={statusPrimary.className}>
                        {statusPrimary.icon}
                        {employee.statusI}
                      </span>
                    </td>
                    
                    {/* Status Secondary */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={statusSecondary.className}>
                        {statusSecondary.icon}
                        {employee.statusII}
                      </span>
                    </td>
                    
                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center max-w-xs">
                        <Mail className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-900 truncate">{employee.alamatEmail || '-'}</span>
                      </div>
                    </td>
                    
                    {/* Phone */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 text-green-500 mr-2" />
                        <span className="text-sm font-semibold text-gray-900">{employee.noTelp || '-'}</span>
                      </div>
                    </td>
                    
                    {/* Join Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 text-purple-500 mr-2" />
                        <span className="text-sm font-semibold text-gray-900">{formatDate(employee.tglJoint)}</span>
                      </div>
                    </td>
                    
                    {/* Contract Number */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {employee.kontrakKe}
                      </span>
                    </td>
                    
                    {/* Warning Letters */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.suratPeringatan && employee.suratPeringatan.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {employee.suratPeringatan.map((sp: any) => (
                            <span
                              key={sp.id}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                sp.type === 'SP1'
                                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                  : sp.type === 'SP2'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-red-200 text-red-900 border border-red-300'
                              }`}
                            >
                              <Award className="w-3 h-3 mr-1" />
                              {sp.type}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} z-10 border-l border-gray-200 group-hover:bg-blue-50`}>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onView(employee)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 group"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(employee)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110 group"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(employee.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 group"
                          title="Hapus Karyawan"
                        >
                          <Trash2 className="w-4 h-4 group-hover:animate-pulse" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {employees.length === 0 && (
        <div className="text-center py-16">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-xl">
              <UserPlus className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-700 mb-3">Belum Ada Data Karyawan</h3>
              <p className="text-gray-500 mb-6 font-semibold max-w-md mx-auto">
                Mulai dengan menambahkan karyawan baru atau import data dari file CSV untuk memulai mengelola database karyawan Anda.
              </p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('addEmployee'))}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Karyawan Pertama
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}