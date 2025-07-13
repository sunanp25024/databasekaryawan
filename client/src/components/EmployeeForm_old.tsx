import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { Employee } from '../types/Employee';
import { SPManager } from './SPManager';
import { klienOptions, statusIOptions, statusIIOptions, sourceOptions, bankOptions, areaOptions, cabangOptions, jenisKelaminOptions, pendidikanTerakhirOptions, agamaOptions } from '../data/mockData';

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
  selectedKlien: string;
  employees: Employee[];
}

export function EmployeeForm({ employee, onSave, onCancel, selectedKlien, employees }: EmployeeFormProps) {
  // Calculate next number based on selected client or all employees
  const getNextNo = () => {
    if (selectedKlien) {
      const clientEmployees = employees.filter(emp => emp.klien === selectedKlien);
      return clientEmployees.length > 0 ? Math.max(...clientEmployees.map(emp => emp.no)) + 1 : 1;
    } else {
      return employees.length > 0 ? Math.max(...employees.map(emp => emp.no)) + 1 : 1;
    }
  };

  const [formData, setFormData] = useState({
    no: employee?.no || getNextNo(),
    klien: employee?.klien || selectedKlien || '',
    namaPic: employee?.namaPic || '',
    area: employee?.area || '',
    cabang: employee?.cabang || '',
    nik: employee?.nik || '',
    namaKaryawan: employee?.namaKaryawan || '',
    posisi: employee?.posisi || '',
    source: employee?.source || '',
    tglJoint: employee?.tglJoint || '',
    tglEoc: employee?.tglEoc || '',
    statusI: employee?.statusI || 'Active',
    statusII: employee?.statusII || 'Contract',
    tglResign: employee?.tglResign || '',
    reasonResign: employee?.reasonResign || '',
    pkwt: employee?.pkwt || '',
    noPkwt: employee?.noPkwt || '',
    bpjsKetenagakerjaan: employee?.bpjsKetenagakerjaan || '',
    bpjsKesehatan: employee?.bpjsKesehatan || '',
    bank: employee?.bank || '',
    noRekening: employee?.noRekening || '',
    namaPenerima: employee?.namaPenerima || '',
    alamatEmail: employee?.alamatEmail || '',
    noTelp: employee?.noTelp || '',
    kontrakKe: employee?.kontrakKe || 1,
    jenisKelamin: employee?.jenisKelamin || '',
    pendidikanTerakhir: employee?.pendidikanTerakhir || '',
    agama: employee?.agama || '',
    suratPeringatan: employee?.suratPeringatan || []
  });

  // Helper function to convert date formats
  const convertDateToISO = (dateStr: string): string => {
    if (!dateStr) return '';
    
    // If already in ISO format (YYYY-MM-DD), return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // If in format like "Saturday, January 11, 2025", parse it
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Date conversion error:', e);
    }
    
    return '';
  };

  // Helper function to normalize status values
  const normalizeStatus = (status: string): string => {
    if (!status) return '';
    
    // Map common variations to standard values
    const statusMap: { [key: string]: string } = {
      'AKTIF': 'Active',
      'AKTIVE': 'Active', 
      'ACTIVE': 'Active',
      'RESIGN': 'Resigned',
      'RESIGNED': 'Resigned'
    };
    
    return statusMap[status.toUpperCase()] || status;
  };

  // Helper function to normalize gender values
  const normalizeGender = (gender: string): string => {
    if (!gender) return '';
    
    const genderMap: { [key: string]: string } = {
      'L': 'Laki-laki',
      'P': 'Perempuan', 
      'M': 'Laki-laki',
      'F': 'Perempuan',
      'MALE': 'Laki-laki',
      'FEMALE': 'Perempuan'
    };
    
    return genderMap[gender.toUpperCase()] || gender;
  };

  // Helper function to normalize education values  
  const normalizeEducation = (education: string): string => {
    if (!education) return '';
    
    const educationMap: { [key: string]: string } = {
      'SMK': 'SMA/SMK',
      'SMA': 'SMA/SMK',
      'SMU': 'SMA/SMK',
      'D1': 'D1',
      'D2': 'D2', 
      'D3': 'D3',
      'DIPLOMA': 'D3',
      'S1': 'S1',
      'SARJANA': 'S1',
      'S2': 'S2',
      'MAGISTER': 'S2',
      'S3': 'S3',
      'DOKTOR': 'S3'
    };
    
    return educationMap[education.toUpperCase()] || education;
  };

  useEffect(() => {
    if (employee) {
      const newFormData = {
        no: employee.no,
        klien: employee.klien,
        namaPic: employee.namaPic || '',
        area: employee.area || '',
        cabang: employee.cabang || '',
        nik: employee.nik || '',
        namaKaryawan: employee.namaKaryawan || '',
        posisi: employee.posisi || '',
        source: employee.source || '',
        tglJoint: convertDateToISO(employee.tglJoint) || '',
        tglEoc: convertDateToISO(employee.tglEoc) || '',
        statusI: normalizeStatus(employee.statusI) || 'Active',
        statusII: employee.statusII || 'Contract',
        tglResign: convertDateToISO(employee.tglResign) || '',
        reasonResign: employee.reasonResign || '',
        pkwt: employee.pkwt || '',
        noPkwt: employee.noPkwt || '',
        bpjsKetenagakerjaan: employee.bpjsKetenagakerjaan || '',
        bpjsKesehatan: employee.bpjsKesehatan || '',
        bank: employee.bank || '',
        noRekening: employee.noRekening || '',
        namaPenerima: employee.namaPenerima || '',
        alamatEmail: employee.alamatEmail || '',
        noTelp: employee.noTelp || '',
        kontrakKe: employee.kontrakKe || 1,
        jenisKelamin: normalizeGender(employee.jenisKelamin) || '',
        pendidikanTerakhir: normalizeEducation(employee.pendidikanTerakhir) || '',
        agama: employee.agama || '',
        suratPeringatan: employee.suratPeringatan || []
      };
      setFormData(newFormData);
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'no' || name === 'kontrakKe' ? parseInt(value) || 0 : value
    }));
  };

  const handleSPChange = (suratPeringatan: any[]) => {
    setFormData(prev => ({
      ...prev,
      suratPeringatan
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {employee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
              </h2>
              <p className="text-sm text-gray-600 font-semibold">
                {employee ? 'Perbarui informasi karyawan' : 'Lengkapi form untuk menambah karyawan baru'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-10">
            {/* Section 1: Informasi Dasar */}
            <div className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 pb-3 border-b border-blue-200 flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="hidden">
                  <label className="block text-sm font-bold text-gray-700 mb-2">No</label>
                  <input
                    type="number"
                    name="no"
                    value={formData.no}
                    readOnly
                    required
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed font-semibold"
                    title="Nomor otomatis terisi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Klien *</label>
                  <select
                    name="klien"
                    value={formData.klien}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium"
                  >
                    <option value="">Pilih Klien</option>
                    {klienOptions.map((klien) => (
                      <option key={klien} value={klien}>{klien}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama PIC</label>
                  <input
                    type="text"
                    name="namaPic"
                    value={formData.namaPic}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium"
                    placeholder="Nama Person In Charge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Area *</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium"
                    placeholder="Masukkan Area"
                    list="area-options"
                  />
                  <datalist id="area-options">
                    {areaOptions.map((area) => (
                      <option key={area} value={area} />
                    ))}
                  </datalist>
                </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Cabang *</label>
              <input
                type="text"
                name="cabang"
                value={formData.cabang}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
                placeholder="Masukkan Cabang"
                list="cabang-options"
              />
              <datalist id="cabang-options">
                {cabangOptions.map((cabang) => (
                  <option key={cabang} value={cabang} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">NIK *</label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-mono font-semibold shadow-sm hover:shadow-md"
                placeholder="Nomor Induk Kependudukan"
              />
            </div>

            {/* Employee Details */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-black text-gray-900 mb-6 mt-8 pb-3 border-b-2 border-emerald-200 flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                Detail Karyawan
              </h3>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Nama Karyawan *</label>
              <input
                type="text"
                name="namaKaryawan"
                value={formData.namaKaryawan}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
                placeholder="Nama lengkap karyawan"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Posisi *</label>
              <input
                type="text"
                name="posisi"
                value={formData.posisi}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
                placeholder="Jabatan/posisi"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Source *</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
                placeholder="Masukkan Source Recruitment"
                list="source-options"
              />
              <datalist id="source-options">
                {sourceOptions.map((source) => (
                  <option key={source} value={source} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Tanggal Joint *</label>
              <input
                type="date"
                name="tglJoint"
                value={formData.tglJoint}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Tanggal EOC *</label>
              <input
                type="date"
                name="tglEoc"
                value={formData.tglEoc}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Status I *</label>
              <select
                name="statusI"
                value={formData.statusI}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              >
                {statusIOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Status II *</label>
              <select
                name="statusII"
                value={formData.statusII}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              >
                {statusIIOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Tanggal Resign</label>
              <input
                type="date"
                name="tglResign"
                value={formData.tglResign}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Reason Resign</label>
              <input
                type="text"
                name="reasonResign"
                value={formData.reasonResign}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
                placeholder="Alasan resign"
              />
            </div>

            {/* Contract Information */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-black text-gray-900 mb-6 mt-8 pb-3 border-b-2 border-purple-200 flex items-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                Informasi Kontrak & BPJS
              </h3>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">PKWT</label>
              <input
                type="text"
                name="pkwt"
                value={formData.pkwt}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
                placeholder="Jenis PKWT"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">No PKWT</label>
              <input
                type="text"
                name="noPkwt"
                value={formData.noPkwt}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-mono font-semibold shadow-sm hover:shadow-md"
                placeholder="Nomor PKWT"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">BPJS Ketenagakerjaan</label>
              <input
                type="text"
                name="bpjsKetenagakerjaan"
                value={formData.bpjsKetenagakerjaan}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-mono font-semibold shadow-sm hover:shadow-md"
                placeholder="Nomor BPJS Ketenagakerjaan"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">BPJS Kesehatan</label>
              <input
                type="text"
                name="bpjsKesehatan"
                value={formData.bpjsKesehatan}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-mono font-semibold shadow-sm hover:shadow-md"
                placeholder="Nomor BPJS Kesehatan"
              />
            </div>

            {/* Personal Information */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-black text-gray-900 mb-6 mt-8 pb-3 border-b-2 border-green-200 flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Informasi Personal
              </h3>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Jenis Kelamin *</label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              >
                <option value="">Pilih Jenis Kelamin</option>
                {jenisKelaminOptions.map((jk) => (
                  <option key={jk} value={jk}>{jk}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Pendidikan Terakhir *</label>
              <select
                name="pendidikanTerakhir"
                value={formData.pendidikanTerakhir}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              >
                <option value="">Pilih Pendidikan Terakhir</option>
                {pendidikanTerakhirOptions.map((pendidikan) => (
                  <option key={pendidikan} value={pendidikan}>{pendidikan}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Agama *</label>
              <select
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              >
                <option value="">Pilih Agama</option>
                {agamaOptions.map((agama) => (
                  <option key={agama} value={agama}>{agama}</option>
                ))}
              </select>
            </div>

            {/* Banking Information */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-black text-gray-900 mb-6 mt-8 pb-3 border-b-2 border-amber-200 flex items-center">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                Informasi Bank & Kontak
              </h3>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Bank</label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              >
                <option value="">Pilih Bank</option>
                {bankOptions.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">No Rekening</label>
              <input
                type="text"
                name="noRekening"
                value={formData.noRekening}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-mono font-semibold shadow-sm hover:shadow-md"
                placeholder="Nomor rekening"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Nama Penerima</label>
              <input
                type="text"
                name="namaPenerima"
                value={formData.namaPenerima}
                onChange={handleChange}
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
                placeholder="Nama penerima rekening"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Email *</label>
              <input
                type="email"
                name="alamatEmail"
                value={formData.alamatEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
                placeholder="alamat@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">No Telp *</label>
              <input
                type="tel"
                name="noTelp"
                value={formData.noTelp}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-mono font-semibold shadow-sm hover:shadow-md"
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-3">Kontrak Ke</label>
              <input
                type="number"
                name="kontrakKe"
                value={formData.kontrakKe}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-white font-semibold shadow-sm hover:shadow-md"
              />
            </div>

            {/* Surat Peringatan Information */}
            <div className="lg:col-span-3">
              <div className="mt-6">
                <SPManager
                  suratPeringatan={formData.suratPeringatan}
                  onChange={handleSPChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t-2 border-gray-200 sticky bottom-0 bg-white rounded-b-3xl">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-8 py-3.5 text-base text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-200 font-black shadow-lg hover:shadow-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-black shadow-xl hover:shadow-2xl"
            >
              <Save className="w-5 h-5 mr-2" />
              {employee ? 'Update' : 'Simpan'} Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}