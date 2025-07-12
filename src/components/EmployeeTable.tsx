import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
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
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <div key={employee.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{employee.namaKaryawan}</h3>
                  <p className="text-xs text-gray-500 truncate">{employee.posisi}</p>
                  <p className="text-xs text-gray-500">{employee.klien} • {employee.area}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={() => onView(employee)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(employee)}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
                <p>Email: {employee.alamatEmail}</p>
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
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">No</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klien</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama PIC</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Karyawan</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Joint</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl EOC</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status I</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status II</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Resign</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason Resign</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PKWT</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No PKWT</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BPJS Ketenagakerjaan</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BPJS Kesehatan</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Rekening</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Bank</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update No Rekening</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Telp</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontrak Ke</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surat Peringatan</th>
              <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 sticky left-0 bg-white z-10">{employee.no}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.klien}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.namaPic}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.area}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.cabang}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 font-mono">{employee.nik}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-gray-900">{employee.namaKaryawan}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.posisi}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.source}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{formatDate(employee.tglJoint)}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{formatDate(employee.tglEoc)}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap">
                  <span className={getStatusBadge(employee.statusI, 'primary')}>{employee.statusI}</span>
                </td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap">
                  <span className={getStatusBadge(employee.statusII, 'secondary')}>{employee.statusII}</span>
                </td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{formatDate(employee.tglResign)}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.reasonResign || '-'}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.pkwt}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 font-mono">{employee.noPkwt}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 font-mono">{employee.bpjsKetenagakerjaan}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 font-mono">{employee.bpjsKesehatan}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.bank}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 font-mono">{employee.noRekening}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{formatDate(employee.updateBank)}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{formatDate(employee.updateNoRekening)}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.alamatEmail}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.noTelp}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">{employee.kontrakKe}</td>
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                  {employee.suratPeringatan && employee.suratPeringatan.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {employee.suratPeringatan.map((sp) => (
                        <span
                          key={sp.id}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                <td className="px-2 lg:px-3 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 sticky right-0 bg-white z-10">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(employee)}
                      className="p-1 lg:p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(employee)}
                      className="p-1 lg:p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="p-1 lg:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
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
          <div className="text-gray-400 text-lg mb-2">Tidak ada data karyawan</div>
          <p className="text-gray-500">Silakan tambah karyawan baru atau sesuaikan filter pencarian</p>
        </div>
      )}
    </div>
  );
}