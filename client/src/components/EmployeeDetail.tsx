import React from 'react';
import { X, User, Building, Calendar, CreditCard, Phone, Mail, MapPin, Briefcase, Clock, Award } from 'lucide-react';
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
    const baseClasses = "px-4 py-2 rounded-xl text-sm font-bold shadow-lg";
    
    if (type === 'primary') {
      switch (status) {
        case 'Active':
          return `${baseClasses} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white ring-2 ring-emerald-200`;
        case 'Resigned':
          return `${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white ring-2 ring-red-200`;
        case 'Terminated':
          return `${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white ring-2 ring-gray-200`;
        default:
          return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white`;
      }
    } else {
      switch (status) {
        case 'Permanent':
          return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-2 ring-blue-200`;
        case 'Contract':
          return `${baseClasses} bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-2 ring-amber-200`;
        case 'Probation':
          return `${baseClasses} bg-gradient-to-r from-yellow-500 to-yellow-600 text-white ring-2 ring-yellow-200`;
        default:
          return `${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white`;
      }
    }
  };

  const getKlienColor = (klien: string) => {
    switch (klien) {
      case 'ADIRA':
        return 'from-blue-600 to-blue-700';
      case 'MACF':
        return 'from-emerald-600 to-emerald-700';
      case 'SMSF':
        return 'from-purple-600 to-purple-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto border border-gray-200">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-6 lg:p-8 rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-t-3xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <h2 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
              Detail Karyawan
            </h2>
            <button
              onClick={onClose}
              className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Enhanced Employee Header */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-6 lg:p-8 border border-blue-200/50 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className={`w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${getKlienColor(employee.klien)} rounded-3xl flex items-center justify-center text-white text-2xl lg:text-3xl font-bold shadow-xl ring-4 ring-white`}>
                {employee.namaKaryawan.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">{employee.namaKaryawan}</h3>
                <p className="text-lg lg:text-xl text-gray-600 font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  {employee.posisi}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={getStatusBadge(employee.statusI, 'primary')}>{employee.statusI}</span>
                  <span className={getStatusBadge(employee.statusII, 'secondary')}>{employee.statusII}</span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${getKlienColor(employee.klien)} text-white shadow-lg`}>
                    {employee.klien}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information Sections with Enhanced Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Basic Information */}
            <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-lg border border-blue-100/50">
              <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center pb-3 border-b border-blue-200">
                <User className="w-6 h-6 mr-3 text-blue-600" />
                Informasi Dasar
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'NIK', value: employee.nik, icon: '🆔' },
                  { label: 'Nama PIC', value: employee.namaPic, icon: '👤' },
                  { label: 'Source', value: employee.source, icon: '📍' },
                  { label: 'Kontrak Ke', value: employee.kontrakKe, icon: '📋' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-6 shadow-lg border border-emerald-100/50">
              <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center pb-3 border-b border-emerald-200">
                <MapPin className="w-6 h-6 mr-3 text-emerald-600" />
                Lokasi & Area
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Area', value: employee.area, icon: '🌍' },
                  { label: 'Cabang', value: employee.cabang, icon: '🏢' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-emerald-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment Dates */}
            <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-6 shadow-lg border border-purple-100/50">
              <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center pb-3 border-b border-purple-200">
                <Calendar className="w-6 h-6 mr-3 text-purple-600" />
                Tanggal Penting
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Tanggal Joint', value: formatDate(employee.tglJoint), icon: '📅' },
                  { label: 'Tanggal EOC', value: formatDate(employee.tglEoc), icon: '📆' },
                  ...(employee.tglResign ? [
                    { label: 'Tanggal Resign', value: formatDate(employee.tglResign), icon: '🚪' },
                    { label: 'Alasan Resign', value: employee.reasonResign || '-', icon: '📝' }
                  ] : [])
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-purple-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract & BPJS */}
            <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 shadow-lg border border-amber-100/50">
              <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center pb-3 border-b border-amber-200">
                <Building className="w-6 h-6 mr-3 text-amber-600" />
                Kontrak & BPJS
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'PKWT', value: employee.pkwt, icon: '📄' },
                  { label: 'No PKWT', value: employee.noPkwt, icon: '🔢' },
                  { label: 'BPJS Ketenagakerjaan', value: employee.bpjsKetenagakerjaan, icon: '🛡️' },
                  { label: 'BPJS Kesehatan', value: employee.bpjsKesehatan, icon: '🏥' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-amber-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Banking Information */}
            <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-lg border border-green-100/50">
              <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center pb-3 border-b border-green-200">
                <CreditCard className="w-6 h-6 mr-3 text-green-600" />
                Informasi Bank
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Bank', value: employee.bank, icon: '🏦' },
                  { label: 'No Rekening', value: employee.noRekening, icon: '💳' },
                  { label: 'Nama Penerima', value: employee.namaPenerima, icon: '👤' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-green-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-6 shadow-lg border border-indigo-100/50">
              <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center pb-3 border-b border-indigo-200">
                <User className="w-6 h-6 mr-3 text-indigo-600" />
                Informasi Personal
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Jenis Kelamin', value: employee.jenisKelamin, icon: '👤' },
                  { label: 'Pendidikan Terakhir', value: employee.pendidikanTerakhir, icon: '🎓' },
                  { label: 'Agama', value: employee.agama, icon: '🕌' },
                  { label: 'Email', value: employee.alamatEmail, icon: '📧' },
                  { label: 'No Telp', value: employee.noTelp, icon: '📱' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-xl border border-indigo-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Surat Peringatan Information */}
          <div className="bg-gradient-to-br from-white to-red-50/50 rounded-2xl p-6 shadow-lg border border-red-100/50">
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