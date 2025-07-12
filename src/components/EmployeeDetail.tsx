import React from 'react';
import { X, User, Building, Calendar, CreditCard, Phone, Mail } from 'lucide-react';
import { Employee } from '../types/Employee';
import { SPManager } from './SPManager';

interface EmployeeDetailProps {
  employee: Employee;
  onClose: () => void;
}

export function EmployeeDetail({ employee, onClose }: EmployeeDetailProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string, type: 'primary' | 'secondary' = 'primary') => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    
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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] lg:max-h-screen overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Detail Karyawan
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 lg:p-8 space-y-8 lg:space-y-10">
          {/* Header */}
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl font-bold shadow-lg">
              {employee.namaKaryawan.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{employee.namaKaryawan}</h3>
              <p className="text-lg lg:text-xl text-gray-600 font-medium mb-3">{employee.posisi}</p>
              <div className="flex items-center space-x-3">
                <span className={getStatusBadge(employee.statusI, 'primary')}>{employee.statusI}</span>
                <span className={getStatusBadge(employee.statusII, 'secondary')}>{employee.statusII}</span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-5 flex items-center pb-2 border-b border-gray-200">
              <User className="w-5 h-5 mr-2" />
              Informasi Dasar
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-500">No</label>
                <p className="text-sm lg:text-base text-gray-900">{employee.no}</p>
              </div>
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-500">NIK</label>
                <p className="text-sm lg:text-base text-gray-900 font-mono">{employee.nik}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Klien</label>
                <p className="text-gray-900">{employee.klien}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Nama PIC</label>
                <p className="text-gray-900">{employee.namaPic}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Area</label>
                <p className="text-gray-900">{employee.area}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Cabang</label>
                <p className="text-gray-900">{employee.cabang}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Source</label>
                <p className="text-gray-900">{employee.source}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Kontrak Ke</label>
                <p className="text-gray-900">{employee.kontrakKe}</p>
              </div>
            </div>
          </div>

          {/* Employment Dates */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Tanggal Penting
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Tanggal Joint</label>
                <p className="text-gray-900">{formatDate(employee.tglJoint)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Tanggal EOC</label>
                <p className="text-gray-900">{formatDate(employee.tglEoc)}</p>
              </div>
              {employee.tglResign && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tanggal Resign</label>
                    <p className="text-gray-900">{formatDate(employee.tglResign)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Alasan Resign</label>
                    <p className="text-gray-900">{employee.reasonResign || '-'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contract & BPJS */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Kontrak & BPJS
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">PKWT</label>
                <p className="text-gray-900">{employee.pkwt}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">No PKWT</label>
                <p className="text-gray-900 font-mono">{employee.noPkwt}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">BPJS Ketenagakerjaan</label>
                <p className="text-gray-900 font-mono">{employee.bpjsKetenagakerjaan}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">BPJS Kesehatan</label>
                <p className="text-gray-900 font-mono">{employee.bpjsKesehatan}</p>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Informasi Bank
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Bank</label>
                <p className="text-gray-900">{employee.bank}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">No Rekening</label>
                <p className="text-gray-900 font-mono">{employee.noRekening}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Update Bank</label>
                <p className="text-gray-900">{formatDate(employee.updateBank)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Update No Rekening</label>
                <p className="text-gray-900">{formatDate(employee.updateNoRekening)}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Informasi Kontak
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{employee.alamatEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">No Telp</label>
                <p className="text-gray-900">{employee.noTelp}</p>
              </div>
            </div>
          </div>

          {/* Surat Peringatan Information */}
          <div>
            <SPManager
              suratPeringatan={employee.suratPeringatan || []}
              onChange={() => {}} // Read-only mode
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}