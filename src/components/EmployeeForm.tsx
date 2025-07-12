import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Employee } from '../types/Employee';
import { SPManager } from './SPManager';
import { klienOptions, statusIOptions, statusIIOptions, sourceOptions, bankOptions } from '../data/mockData';

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
    namaPic: '',
    area: '',
    cabang: '',
    nik: '',
    namaKaryawan: '',
    posisi: '',
    source: '',
    tglJoint: '',
    tglEoc: '',
    statusI: 'Active',
    statusII: 'Contract',
    tglResign: '',
    reasonResign: '',
    pkwt: '',
    noPkwt: '',
    bpjsKetenagakerjaan: '',
    bpjsKesehatan: '',
    bank: '',
    noRekening: '',
    updateBank: '',
    updateNoRekening: '',
    alamatEmail: '',
    noTelp: '',
    kontrakKe: 1,
    suratPeringatan: []
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        no: employee.no,
        klien: employee.klien,
        namaPic: employee.namaPic,
        area: employee.area,
        cabang: employee.cabang,
        nik: employee.nik,
        namaKaryawan: employee.namaKaryawan,
        posisi: employee.posisi,
        source: employee.source,
        tglJoint: employee.tglJoint,
        tglEoc: employee.tglEoc,
        statusI: employee.statusI,
        statusII: employee.statusII,
        tglResign: employee.tglResign,
        reasonResign: employee.reasonResign,
        pkwt: employee.pkwt,
        noPkwt: employee.noPkwt,
        bpjsKetenagakerjaan: employee.bpjsKetenagakerjaan,
        bpjsKesehatan: employee.bpjsKesehatan,
        bank: employee.bank,
        noRekening: employee.noRekening,
        updateBank: employee.updateBank,
        updateNoRekening: employee.updateNoRekening,
        alamatEmail: employee.alamatEmail,
        noTelp: employee.noTelp,
        kontrakKe: employee.kontrakKe,
        suratPeringatan: employee.suratPeringatan || []
      });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] lg:max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
            {employee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-3">
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4">Informasi Dasar</h3>
            </div>
            
            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">No</label>
              <input
                type="number"
                name="no"
                value={formData.no}
                readOnly
                required
                className="w-full px-2 lg:px-3 py-1.5 lg:py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                title="Nomor otomatis terisi"
              />
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Klien</label>
              <select
                name="klien"
                value={formData.klien}
                onChange={handleChange}
                required
                className="w-full px-2 lg:px-3 py-1.5 lg:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Klien</option>
                {klienOptions.map((klien) => (
                  <option key={klien} value={klien}>{klien}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Nama PIC</label>
              <input
                type="text"
                name="namaPic"
                value={formData.namaPic}
                onChange={handleChange}
                required
                className="w-full px-2 lg:px-3 py-1.5 lg:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama Person In Charge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cabang</label>
              <input
                type="text"
                name="cabang"
                value={formData.cabang}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan cabang"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nomor Induk Kependudukan"
              />
            </div>

            {/* Employee Details */}
            <div className="lg:col-span-3">
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4 mt-4 lg:mt-6">Detail Karyawan</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Karyawan</label>
              <input
                type="text"
                name="namaKaryawan"
                value={formData.namaKaryawan}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama lengkap karyawan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
              <input
                type="text"
                name="posisi"
                value={formData.posisi}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jabatan/posisi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Source</option>
                {sourceOptions.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Joint</label>
              <input
                type="date"
                name="tglJoint"
                value={formData.tglJoint}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal EOC</label>
              <input
                type="date"
                name="tglEoc"
                value={formData.tglEoc}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status I</label>
              <select
                name="statusI"
                value={formData.statusI}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusIOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status II</label>
              <select
                name="statusII"
                value={formData.statusII}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusIIOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Resign</label>
              <input
                type="date"
                name="tglResign"
                value={formData.tglResign}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason Resign</label>
              <input
                type="text"
                name="reasonResign"
                value={formData.reasonResign}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alasan resign"
              />
            </div>

            {/* Contract Information */}
            <div className="lg:col-span-3">
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4 mt-4 lg:mt-6">Informasi Kontrak & BPJS</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PKWT</label>
              <input
                type="text"
                name="pkwt"
                value={formData.pkwt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jenis PKWT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No PKWT</label>
              <input
                type="text"
                name="noPkwt"
                value={formData.noPkwt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nomor PKWT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BPJS Ketenagakerjaan</label>
              <input
                type="text"
                name="bpjsKetenagakerjaan"
                value={formData.bpjsKetenagakerjaan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nomor BPJS Ketenagakerjaan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BPJS Kesehatan</label>
              <input
                type="text"
                name="bpjsKesehatan"
                value={formData.bpjsKesehatan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nomor BPJS Kesehatan"
              />
            </div>

            {/* Banking Information */}
            <div className="lg:col-span-3">
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4 mt-4 lg:mt-6">Informasi Bank & Kontak</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank</label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Bank</option>
                {bankOptions.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Rekening</label>
              <input
                type="text"
                name="noRekening"
                value={formData.noRekening}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nomor rekening"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Bank</label>
              <input
                type="date"
                name="updateBank"
                value={formData.updateBank}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update No Rekening</label>
              <input
                type="date"
                name="updateNoRekening"
                value={formData.updateNoRekening}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="alamatEmail"
                value={formData.alamatEmail}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="alamat@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Telp</label>
              <input
                type="tel"
                name="noTelp"
                value={formData.noTelp}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kontrak Ke</label>
              <input
                type="number"
                name="kontrakKe"
                value={formData.kontrakKe}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Surat Peringatan Information */}
            <div className="lg:col-span-3">
              <div className="mt-4 lg:mt-6">
                <SPManager
                  suratPeringatan={formData.suratPeringatan}
                  onChange={handleSPChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 lg:pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 lg:px-4 py-2 text-sm lg:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
              {employee ? 'Update' : 'Simpan'} Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}