import { Employee } from '../types/Employee';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    no: 1,
    klien: 'ADIRA',
    namaPic: 'John Doe',
    sentra: 'Jakarta Pusat',
    cabang: 'Head Office',
    nik: '3171234567890001',
    namaKaryawan: 'Ahmad Pratama',
    posisi: 'Software Developer',
    source: 'Internal Recruitment',
    tglJoint: '2023-01-15',
    tglEoc: '2023-12-31',
    statusI: 'Active',
    statusII: 'Permanent',
    tglResign: '',
    reasonResign: '',
    pkwt: 'PKWT-001',
    noPkwt: 'PKW/2023/001',
    bpjsKetenagakerjaan: '12345678901',
    bpjsKesehatan: '0001234567890',
    bank: 'BCA',
    noRekening: '1234567890',
    updateBank: '2023-01-20',
    updateNoRekening: '2023-01-20',
    alamatEmail: 'ahmad.pratama@company.com',
    noTelp: '+62 812-3456-7890',
    kontrakKe: 1
  },
  {
    id: '2',
    no: 2,
    klien: 'MACF',
    namaPic: 'Jane Smith',
    sentra: 'Jakarta Selatan',
    cabang: 'Branch A',
    nik: '3171234567890002',
    namaKaryawan: 'Sari Dewi',
    posisi: 'Marketing Specialist',
    source: 'External Recruitment',
    tglJoint: '2023-02-10',
    tglEoc: '2024-02-09',
    statusI: 'Active',
    statusII: 'Contract',
    tglResign: '',
    reasonResign: '',
    pkwt: 'PKWT-002',
    noPkwt: 'PKW/2023/002',
    bpjsKetenagakerjaan: '12345678902',
    bpjsKesehatan: '0001234567891',
    bank: 'Mandiri',
    noRekening: '2345678901',
    updateBank: '2023-02-15',
    updateNoRekening: '2023-02-15',
    alamatEmail: 'sari.dewi@company.com',
    noTelp: '+62 821-9876-5432',
    kontrakKe: 1
  },
  {
    id: '3',
    no: 3,
    klien: 'SMSF',
    namaPic: 'Robert Johnson',
    sentra: 'Bandung',
    cabang: 'Branch B',
    nik: '3271234567890003',
    namaKaryawan: 'Budi Santoso',
    posisi: 'Financial Analyst',
    source: 'Referral',
    tglJoint: '2022-11-20',
    tglEoc: '2023-11-19',
    statusI: 'Resigned',
    statusII: 'Contract',
    tglResign: '2023-10-15',
    reasonResign: 'Personal Reason',
    pkwt: 'PKWT-003',
    noPkwt: 'PKW/2022/003',
    bpjsKetenagakerjaan: '12345678903',
    bpjsKesehatan: '0001234567892',
    bank: 'BRI',
    noRekening: '3456789012',
    updateBank: '2022-11-25',
    updateNoRekening: '2022-11-25',
    alamatEmail: 'budi.santoso@company.com',
    noTelp: '+62 813-2468-1357',
    kontrakKe: 1
  },
  {
    id: '4',
    no: 4,
    klien: 'ADIRA',
    namaPic: 'Lisa Anderson',
    sentra: 'Surabaya',
    cabang: 'Branch C',
    nik: '3571234567890004',
    namaKaryawan: 'Lisa Rahman',
    posisi: 'HR Specialist',
    source: 'Job Portal',
    tglJoint: '2023-03-05',
    tglEoc: '2024-03-04',
    statusI: 'Active',
    statusII: 'Contract',
    tglResign: '',
    reasonResign: '',
    pkwt: 'PKWT-004',
    noPkwt: 'PKW/2023/004',
    bpjsKetenagakerjaan: '12345678904',
    bpjsKesehatan: '0001234567893',
    bank: 'BNI',
    noRekening: '4567890123',
    updateBank: '2023-03-10',
    updateNoRekening: '2023-03-10',
    alamatEmail: 'lisa.rahman@company.com',
    noTelp: '+62 856-7890-1234',
    kontrakKe: 2
  },
  {
    id: '5',
    no: 5,
    klien: 'MACF',
    namaPic: 'Michael Brown',
    sentra: 'Medan',
    cabang: 'Branch D',
    nik: '1271234567890005',
    namaKaryawan: 'Deni Kurniawan',
    posisi: 'Operations Manager',
    source: 'Headhunter',
    tglJoint: '2022-08-12',
    tglEoc: '2024-08-11',
    statusI: 'Active',
    statusII: 'Permanent',
    tglResign: '',
    reasonResign: '',
    pkwt: 'PKWT-005',
    noPkwt: 'PKW/2022/005',
    bpjsKetenagakerjaan: '12345678905',
    bpjsKesehatan: '0001234567894',
    bank: 'CIMB Niaga',
    noRekening: '5678901234',
    updateBank: '2022-08-17',
    updateNoRekening: '2022-08-17',
    alamatEmail: 'deni.kurniawan@company.com',
    noTelp: '+62 878-5432-9876',
    kontrakKe: 1
  }
];

export const klienOptions = [
  'ADIRA',
  'MACF',
  'SMSF'
];

export const sentraOptions = [
  'Jakarta Pusat',
  'Jakarta Selatan',
  'Bandung',
  'Surabaya',
  'Medan'
];

export const cabangOptions = [
  'Head Office',
  'Branch A',
  'Branch B', 
  'Branch C',
  'Branch D'
];

export const statusIOptions = [
  'Active',
  'Resigned',
  'Terminated'
];

export const statusIIOptions = [
  'Permanent',
  'Contract',
  'Probation'
];

export const sourceOptions = [
  'Internal Recruitment',
  'External Recruitment',
  'Referral',
  'Job Portal',
  'Headhunter'
];

export const bankOptions = [
  'BCA',
  'Mandiri',
  'BRI',
  'BNI',
  'CIMB Niaga',
  'Danamon',
  'Permata'
];