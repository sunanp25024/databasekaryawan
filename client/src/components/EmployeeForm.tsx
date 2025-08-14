import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { X, User, Plus, Trash2 } from 'lucide-react';
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

  const [nikError, setNikError] = useState('');
  const [emailError, setEmailError] = useState('');

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
      'AKTIF': 'AKTIF',
      'AKTIVE': 'AKTIF', 
      'ACTIVE': 'AKTIF',
      'RESIGN': 'RESIGN',
      'RESIGNED': 'RESIGN'
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
        statusI: normalizeStatus(employee.statusI) || 'AKTIF',
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Check for empty NIK
    if (!formData.nik.trim()) {
      alert('❌ NIK tidak boleh kosong');
      return;
    }
    
    // Final duplicate check before submission
    const existingEmployee = employees.find(emp => 
      emp.nik === formData.nik.trim() && emp.id !== employee?.id
    );
    
    if (existingEmployee) {
      alert(`❌ DATA DUPLIKAT DITOLAK!\n\nNIK "${formData.nik}" sudah digunakan oleh:\n👤 ${existingEmployee.namaKaryawan}\n🏢 ${existingEmployee.klien}\n📍 ${existingEmployee.area}\n\nSilakan gunakan NIK yang berbeda.`);
      return;
    }
    
    // Prevent submission if there's NIK error
    if (nikError) {
      alert('❌ Tidak dapat menyimpan: ' + nikError);
      return;
    }
    
    // Prevent submission if there's Email error
    if (emailError) {
      alert('❌ Tidak dapat menyimpan: ' + emailError);
      return;
    }
    
    // Check for duplicate email if provided
    if (formData.alamatEmail.trim()) {
      const existingEmailEmployee = employees.find(emp => 
        emp.alamatEmail.toLowerCase() === formData.alamatEmail.trim().toLowerCase() && emp.id !== employee?.id
      );
      
      if (existingEmailEmployee) {
        const proceed = confirm(`⚠️ Email "${formData.alamatEmail}" sudah digunakan oleh:\n👤 ${existingEmailEmployee.namaKaryawan}\n\nApakah Anda yakin ingin melanjutkan?`);
        if (!proceed) return;
      }
    }
    
    onSave(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Check for duplicate NIK
    if (name === 'nik' && value.trim()) {
      const existingEmployee = employees.find(emp => 
        emp.nik === value.trim() && emp.id !== employee?.id
      );
      
      if (existingEmployee) {
        setNikError(`❌ NIK sudah digunakan oleh: ${existingEmployee.namaKaryawan} (${existingEmployee.klien} - ${existingEmployee.area})`);
      } else {
        setNikError('');
      }
    }
    
    // Check for duplicate Email
    if (name === 'alamatEmail' && value.trim()) {
      const existingEmployee = employees.find(emp => 
        emp.alamatEmail.toLowerCase() === value.trim().toLowerCase() && emp.id !== employee?.id
      );
      
      if (existingEmployee) {
        setEmailError(`⚠️ Email sudah digunakan oleh: ${existingEmployee.namaKaryawan} (${existingEmployee.klien})`);
      } else {
        setEmailError('');
      }
    }
    
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
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {employee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
              </h2>
              <p className="text-sm text-gray-600">
                {employee ? 'Perbarui informasi karyawan' : 'Lengkapi form untuk menambah karyawan baru'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Section 1: Informasi Dasar */}
            <div className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-blue-200 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="hidden">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">No</label>
                  <input
                    type="number"
                    name="no"
                    value={formData.no}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Klien *</label>
                  <select
                    name="klien"
                    value={formData.klien}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Pilih Klien</option>
                    {klienOptions.map((klien) => (
                      <option key={klien} value={klien}>{klien}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama PIC</label>
                  <input
                    type="text"
                    name="namaPic"
                    value={formData.namaPic}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nama Person In Charge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Area *</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cabang *</label>
                  <input
                    type="text"
                    name="cabang"
                    value={formData.cabang}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">NIK *</label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 transition-all duration-200 font-mono ${
                      nikError 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Nomor Induk Kependudukan"
                  />
                  {nikError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {nikError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Detail Karyawan */}
            <div className="bg-gradient-to-br from-emerald-50/50 to-white p-6 rounded-xl border border-emerald-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-emerald-200 flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                Detail Karyawan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Karyawan *</label>
                  <input
                    type="text"
                    name="namaKaryawan"
                    value={formData.namaKaryawan}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Nama lengkap karyawan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Posisi *</label>
                  <input
                    type="text"
                    name="posisi"
                    value={formData.posisi}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Jabatan/Posisi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Masukkan Source"
                    list="source-options"
                  />
                  <datalist id="source-options">
                    {sourceOptions.map((source) => (
                      <option key={source} value={source} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Joint *</label>
                  <input
                    type="date"
                    name="tglJoint"
                    value={formData.tglJoint}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal EOC *</label>
                  <input
                    type="date"
                    name="tglEoc"
                    value={formData.tglEoc}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status I *</label>
                  <select
                    name="statusI"
                    value={formData.statusI}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  >
                    {statusIOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status II *</label>
                  <select
                    name="statusII"
                    value={formData.statusII}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  >
                    {statusIIOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Resign</label>
                  <input
                    type="date"
                    name="tglResign"
                    value={formData.tglResign}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Reason Resign</label>
                  <input
                    type="text"
                    name="reasonResign"
                    value={formData.reasonResign}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Alasan resign"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Kontrak & BPJS */}
            <div className="bg-gradient-to-br from-amber-50/50 to-white p-6 rounded-xl border border-amber-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-amber-200 flex items-center">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
                Informasi Kontrak & BPJS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">PKWT</label>
                  <input
                    type="text"
                    name="pkwt"
                    value={formData.pkwt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    placeholder="Jenis PKWT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">No PKWT</label>
                  <input
                    type="text"
                    name="noPkwt"
                    value={formData.noPkwt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-mono"
                    placeholder="Nomor PKWT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">BPJS Ketenagakerjaan</label>
                  <input
                    type="text"
                    name="bpjsKetenagakerjaan"
                    value={formData.bpjsKetenagakerjaan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-mono"
                    placeholder="Nomor BPJS Ketenagakerjaan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">BPJS Kesehatan</label>
                  <input
                    type="text"
                    name="bpjsKesehatan"
                    value={formData.bpjsKesehatan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-mono"
                    placeholder="Nomor BPJS Kesehatan"
                  />
                </div>
              </div>
            </div>

            {/* Section 4A: Informasi Bank */}
            <div className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-blue-200 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Informasi Bank
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bank</label>
                  <select
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Pilih Bank</option>
                    {bankOptions.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">No Rekening</label>
                  <input
                    type="text"
                    name="noRekening"
                    value={formData.noRekening}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono"
                    placeholder="Nomor rekening"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    name="namaPenerima"
                    value={formData.namaPenerima}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nama penerima rekening"
                  />
                </div>
              </div>
            </div>

            {/* Section 4B: Informasi Kontak */}
            <div className="bg-gradient-to-br from-green-50/50 to-white p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-green-200 flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Informasi Kontak
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="alamatEmail"
                    value={formData.alamatEmail}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 transition-all duration-200 ${
                      emailError 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                    }`}
                    placeholder="alamat@email.com"
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">No Telp *</label>
                  <input
                    type="tel"
                    name="noTelp"
                    value={formData.noTelp}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-mono"
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kontrak Ke</label>
                  <input
                    type="number"
                    name="kontrakKe"
                    value={formData.kontrakKe}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Informasi Personal */}
            <div className="bg-gradient-to-br from-purple-50/50 to-white p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-purple-200 flex items-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                Informasi Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Kelamin *</label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    {jenisKelaminOptions.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pendidikan Terakhir *</label>
                  <select
                    name="pendidikanTerakhir"
                    value={formData.pendidikanTerakhir}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="">Pilih Pendidikan</option>
                    {pendidikanTerakhirOptions.map((education) => (
                      <option key={education} value={education}>{education}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Agama</label>
                  <select
                    name="agama"
                    value={formData.agama}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="">Pilih Agama</option>
                    {agamaOptions.map((religion) => (
                      <option key={religion} value={religion}>{religion}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 6: Surat Peringatan */}
            <div className="bg-gradient-to-br from-red-50/50 to-white p-6 rounded-xl border border-red-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-red-200 flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                Surat Peringatan
              </h3>
              <SPManager
                suratPeringatan={formData.suratPeringatan}
                onChange={handleSPChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {employee ? 'Update Karyawan' : 'Simpan Karyawan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}