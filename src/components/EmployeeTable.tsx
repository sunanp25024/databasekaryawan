import React from 'react';
import { Edit, Trash2, Eye, Users, Plus } from 'lucide-react';
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
    const baseClasses = "px-2.5 py-1.5 rounded-full text-xs font-medium";
    
    if (type === 'primary') {
      switch (status) {
        case 'Active':
          return `${baseClasses} bg-green-100 text-green-800`;
        case 'Resigned':
          return `${baseClasses} bg-red-100 text-red-800`;
        case 'Terminated':
          return `${baseClasses} bg-gray-100 text-gray-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    } else {
      switch (status) {
        case 'Permanent':
          return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'Contract':
          return `${baseClasses} bg-orange-100 text-orange-800`;
        case 'Probation':
          return `${baseClasses} bg-yellow-100 text-yellow-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <div key={employee.id} className="p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-l-4 border-transparent hover:border-blue-400">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{employee.namaKaryawan}</h3>
                  <p className="text-xs text-gray-600 truncate font-medium">{employee.posisi}</p>
                  <p className="text-xs text-gray-500 font-medium">{employee.klien} • {employee.area}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={() => onView(employee)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(employee)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-110"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={getStatusBadge(employee.statusI, 'primary')}>{employee.statusI}</span>
                <span className={getStatusBadge(employee.statusII, 'secondary')}>{employee.statusII}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
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
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-bold text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 border-r border-gray-200">No</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-bold text-gray-600 uppercase tracking-wider border-r border-gray-100">Klien</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">Nama PIC</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Area</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Cabang</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">NIK</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[150px]">Nama Karyawan</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[130px]">Posisi</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Source</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">Tgl Joint</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">Tgl EOC</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status I</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status II</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[110px]">Tgl Resign</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[130px]">Reason Resign</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">PKWT</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">No PKWT</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[160px]">BPJS Ketenagakerjaan</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">BPJS Kesehatan</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Bank</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[130px]">No Rekening</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">Update Bank</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[150px]">Update No Rekening</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[180px]">Email</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[130px]">No Telp</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">Kontrak Ke</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">Surat Peringatan</th>
              <th className="px-3 lg:px-4 py-4 lg:py-5 text-left text-sm font-bold text-gray-600 uppercase tracking-wider sticky right-0 bg-gray-50 z-20 border-l border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {employees.map((employee, index) => (
              <tr key={employee.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-sm`}>
                <td className={`px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm font-semibold text-gray-900 sticky left-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} z-10 border-r border-gray-200 hover:bg-blue-50`}>{employee.no}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm font-medium text-gray-900">{employee.klien}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.namaPic}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.area}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.cabang}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900 font-mono">{employee.nik}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm font-semibold text-gray-900">{employee.namaKaryawan}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.posisi}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.source}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{formatDate(employee.tglJoint)}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{formatDate(employee.tglEoc)}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap">
                  <span className={getStatusBadge(employee.statusI, 'primary')}>{employee.statusI}</span>
                </td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap">
                  <span className={getStatusBadge(employee.statusII, 'secondary')}>{employee.statusII}</span>
                </td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{formatDate(employee.tglResign)}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.reasonResign || '-'}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.pkwt}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900 font-mono">{employee.noPkwt}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900 font-mono">{employee.bpjsKetenagakerjaan}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900 font-mono">{employee.bpjsKesehatan}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.bank}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900 font-mono">{employee.noRekening}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{formatDate(employee.updateBank)}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{formatDate(employee.updateNoRekening)}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.alamatEmail}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.noTelp}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">{employee.kontrakKe}</td>
                <td className="px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-900">
                  {employee.suratPeringatan && employee.suratPeringatan.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {employee.suratPeringatan.map((sp) => (
                        <span
                          key={sp.id}
                          className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            sp.type === 'SP1'
                              ? 'bg-orange-100 text-orange-800'
                              : sp.type === 'SP2'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-red-200 text-red-900'
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
                <td className={`px-3 lg:px-4 py-4 lg:py-5 whitespace-nowrap text-sm text-gray-500 sticky right-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} z-10 border-l border-gray-200 hover:bg-blue-50`}>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(employee)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-sm"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(employee)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-sm"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-sm"
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
        <div className="text-center py-8 lg:py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada data karyawan</h3>
              <p className="text-gray-500 mb-4">Silakan tambah karyawan baru atau sesuaikan filter pencarian</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('addEmployee'))}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Karyawan Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}