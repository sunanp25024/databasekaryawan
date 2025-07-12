import React from 'react';
import { Edit, Trash2, Eye, Users, Plus, UserPlus } from 'lucide-react';
import { Employee } from '../types/Employee';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onView: (employee: Employee) => void;
}

export function EmployeeTable({ employees, onEdit, onDelete, onView }: EmployeeTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status: string, type: 'primary' | 'secondary' = 'primary') => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-bold";
    
    if (type === 'primary') {
      switch (status) {
        case 'Active':
          return `${baseClasses} bg-emerald-100 text-emerald-800 border border-emerald-200`;
        case 'Resigned':
          return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
        case 'Terminated':
          return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
      }
    } else {
      switch (status) {
        case 'Permanent':
          return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
        case 'Contract':
          return `${baseClasses} bg-orange-100 text-orange-800 border border-orange-200`;
        case 'Probation':
          return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-100">
          {employees.map((employee) => (
            <div key={employee.id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-gray-900 truncate">{employee.namaKaryawan}</h3>
                  <p className="text-sm text-gray-600 truncate font-bold">{employee.posisi}</p>
                  <p className="text-sm text-gray-500 font-semibold">{employee.klien} • {employee.area}</p>
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  <button
                    onClick={() => onView(employee)}
                    className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(employee)}
                    className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-110"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <span className={getStatusBadge(employee.statusI, 'primary')}>{employee.statusI}</span>
                <span className={getStatusBadge(employee.statusII, 'secondary')}>{employee.statusII}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1 font-medium">
                <p>NIK: {employee.nik}</p>
                <p className="truncate">Email: {employee.alamatEmail}</p>
                <p>Phone: {employee.noTelp}</p>
                <p>Join: {formatDate(employee.tglJoint)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
            <tr>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider sticky left-0 bg-gradient-to-r from-slate-50 to-blue-50 z-20 border-r border-gray-200">No</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider border-r border-gray-100">Klien</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[120px]">Nama PIC</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">Area</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">Cabang</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[140px]">NIK</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[150px]">Nama Karyawan</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[130px]">Posisi</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">Source</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[100px]">Tgl Joint</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[100px]">Tgl EOC</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">Status I</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">Status II</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[110px]">Tgl Resign</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[130px]">Reason Resign</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">PKWT</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[120px]">No PKWT</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[160px]">BPJS Ketenagakerjaan</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[140px]">BPJS Kesehatan</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">Bank</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[130px]">No Rekening</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[120px]">Update Bank</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[150px]">Update No Rekening</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[180px]">Email</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[130px]">No Telp</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[100px]">Kontrak Ke</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider min-w-[140px]">Surat Peringatan</th>
              <th className="px-4 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider sticky right-0 bg-gradient-to-r from-slate-50 to-blue-50 z-20 border-l border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {employees.map((employee, index) => (
              <tr key={employee.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-sm`}>
                <td className={`px-4 py-5 whitespace-nowrap text-sm font-black text-gray-900 sticky left-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} z-10 border-r border-gray-200 hover:bg-blue-50`}>{employee.no}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm font-bold text-gray-900">{employee.klien}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.namaPic}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.area}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.cabang}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-mono font-semibold">{employee.nik}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm font-black text-gray-900">{employee.namaKaryawan}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.posisi}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.source}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatDate(employee.tglJoint)}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatDate(employee.tglEoc)}</td>
                <td className="px-4 py-5 whitespace-nowrap">
                  <span className={getStatusBadge(employee.statusI, 'primary')}>{employee.statusI}</span>
                </td>
                <td className="px-4 py-5 whitespace-nowrap">
                  <span className={getStatusBadge(employee.statusII, 'secondary')}>{employee.statusII}</span>
                </td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatDate(employee.tglResign)}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.reasonResign || '-'}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.pkwt}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-mono font-semibold">{employee.noPkwt}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-mono font-semibold">{employee.bpjsKetenagakerjaan}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-mono font-semibold">{employee.bpjsKesehatan}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.bank}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-mono font-semibold">{employee.noRekening}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatDate(employee.updateBank)}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatDate(employee.updateNoRekening)}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.alamatEmail}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">{employee.noTelp}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 font-bold">{employee.kontrakKe}</td>
                <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900">
                  {employee.suratPeringatan && employee.suratPeringatan.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {employee.suratPeringatan.map((sp) => (
                        <span
                          key={sp.id}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
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
                  ) : (
                    '-'
                  )}
                </td>
                <td className={`px-4 py-5 whitespace-nowrap text-sm text-gray-500 sticky right-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} z-10 border-l border-gray-200 hover:bg-blue-50`}>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(employee)}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(employee)}
                      className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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